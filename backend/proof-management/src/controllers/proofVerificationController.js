var sha256 = require("js-sha256");
const { BloomFilter } = require("bloom-filters");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

var config = require("../config/config");
const Block = require("../models/Block");

/**
 * Tries to verify the existing chain.
 *  - recalculates all hashed to check for changes in blocks
 *  - checks the connections between the blocks for changes
 * 
 * @param {*} resCallback - The callback for the response.
 */
exports.verifyChain = function(resCallback) {
  Block.find({}, function (err, blocks) {
    if (err) {
      console.log("Error while fetching blocks from db:", err);
      resCallback(500, err);
      return;
    }

    // iterate through all blocks
    //  - recalculate hash and check if values are equal
    //  - check if prevHash matches hash of previous block
    for(let count = 1; count < blocks.length; count++) {
      const prevBlock = blocks[count-1];
      const currBlock = blocks[count];

      if(calculateHash(prevBlock) !== currBlock.prevHash) {
        console.log("Chain invalid! Saved hash of previous block not equal to expected hash:",
          "\n current:", currBlock,
          "\n prev:", prevBlock);
        var response = {
          status: "Invalid",
          message: "The chain was invalid! Saved hash of previous block not equal to expected hash.",
          block: currBlock,
          prevBlock: prevBlock,
        };
        resCallback(200, response);
        return;
      }

      if(calculateHash(currBlock) !== currBlock.hash) {
        console.log("Chain invalid! Hash of block not equal to expected hash:", currBlock);
        var response = {
          status: "Invalid",
          message: "The chain was invalid! For at least one block the hash didn't match the expected hash.",
          block: currBlock,
        };
        resCallback(200, response);
        return;
      }
    }

    var reponse = {
      status: "Valid",
      messag: "The chain was valid! No problems detected.",
    };
    resCallback(200, reponse);
  });
}

/**
 * Calculates the hash of a block.
 * Depending on: prevHash, timestamp, data(payload) and nonce
 *  > check proofGenerationController - internalBlock for more info
 * 
 * @param {*} block - The block from the chain. 
 * @returns {string} sha256 hash of the block
 */
function calculateHash(block) {
  var timestamp = new Date(block.timestamp).toISOString();
  return sha256(
    block.prevHash +
    timestamp +
    JSON.stringify(block.data) +
    block.nonce
  ).toString();
}

/**
 * Tries to verify a single log.
 *  - try to find block with startTime endTime matching the timestamp of the log
 *  - get bloom filter from the block and check if log is contained
 * 
 * @param {string} logId - The id of the log in elasticsearch
 * @param {*} resCallback - The callback for the reponse.
 */
exports.verifyLog = function(logId, resCallback) {
  const chainVerificationCallback = (status, message) => {
    if(status != 200) {
      resCallback(status, message);
      return;
    }
  };
  this.verifyChain(chainVerificationCallback);
  // 0. check if chain is still valid
  // 1. get the log
  // 2. find the corresponding block
  // 3. verify
  //  - get bloom filter JSON and import into package
  //  - stringify logs _source
  //  - test string representation with bloom filter
  //  - return result
  const logCallback = (log) => {
    var timestamp = log._source.time;
    Block.findOne( { $and: [ {"data.startTime": {$lt: timestamp}}, {"data.endTime": {$gte: timestamp}} ]}, function(err, block) {
      if (err) {
        console.log("error while fetching block:", err);
        resCallback(500, "error while fetching block");
        return;
      }

      if (block == null) {
        console.log("No block! Log possibly invalid or not yet proven.");
        const response = {
          valid: false,
          status: "Unknown",
          message: `No block found for log with ID ${logId}. The log should be treated as invalid. You can recheck for a corresponding block later.`,
        };
        resCallback(200, response);
        return;
      }

      const bloomJSON = JSON.parse(block.data.bloom);
      const importedBloom = BloomFilter.fromJSON(bloomJSON);
      const logSource = JSON.stringify(log._source);

      const contained = importedBloom.has(logSource);

      console.log(`[verify] Log with ${logId} was: ${contained ? "valid ✔" : "invalid ❌"}`, "\n >> Corresponding block: ", block);

      if(contained) {
        const response = {
          valid: true,
          block: block,
          status: "Valid",
          message: `The log with ID ${logId} was found in block #${block.hash}!`,
        };

        resCallback(200, response);
      } else {
        const response = {
          valid: false,
          block, block,
          status: "Invalid",
          message: `The log with ID ${logID} was not found in the corresponding block #${block.hash}! The log is invalid!`,
        };

        resCallback(200, response);
      }
    });
  } 

  getLog(logId, logCallback);
}

/**
 * Gets a single log by _id from elasticsearch.
 * 
 * @param {string} logId - The id of the log.
 * @param {*} callback - Callback for the calling function.
 */
function getLog(logId, callback) {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          match: {
            "_id": logId
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching log from elasticsearch.");
        throw err;
      }

      var response = result.body.hits.hits;

      if (response.length == 0 || response.length > 1) {
        throw new ReferenceError("Invalid logID.");
      }

      callback(response[0]);
    }
  );
}