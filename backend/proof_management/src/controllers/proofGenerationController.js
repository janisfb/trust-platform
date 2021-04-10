var sha256 = require('js-sha256');
const { BloomFilter } = require("bloom-filters");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

var config = require("../config/config");
const Block = require("../models/Block");

/**
 * Internal representation of block.
 * This class is used to actually mine the block.
 */
class internalBlock {
  constructor(timestamp, data, prevHash = "", diff = 5) {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.nonce = 0;

    this.diff = diff;
    this.mineBlock(this.diff);
  }

  /**
   * Hashes the prevHash, timestamp, data and nonce of the to-be-block.
   * 
   * @returns sha256 hash
   */
  calculateHash() {
    return sha256(
      this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    ).toString();
  }

  /**
   * Will mine the new block by incrementing the nonce.
   * 
   * @param {Number} difficulty - number of required leading zeros for PoW
   */
  mineBlock(difficulty) {
    while (
      !this.hash ||
      !this.hash
        .substring(0, difficulty)
        .split("")
        .every((val) => val === "0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("mined new block! hash: ", this.hash);
  }
}

/**
 * Returns all generated blocks.
 * 
 * @param {*} resCallback - The callback for the response.
 */
exports.getBlocks = function(resCallback) {
  Block.find({}, function (err, blocks) {
    if (err) {
      console.log("Error while fetching blocks from db:", err);
      resCallback(500, err);
      return;
    }

    resCallback(200, blocks);
  });
}

/**
 * Deletes all block entries from the db.
 * 
 * @param {*} resCallback - The callback for the response.
 */
exports.deleteAll = function(resCallback) {
  Block.deleteMany({}, function (err) {
    if (err) {
      console.log("Could not delete blocks.");
      resCallback(500, "Could not delete blocks.");
    }

    resCallback(200, "Deleted all blocks!");
  })
}

/**
 * Creates a block with a bloom filter containing proof of the logs in a specific timeframe.
 * 
 * @param {*} startTime - The startTime for logs that should be contained in the blocks bloom filter.
 * @param {*} endTime - The endTime for logs that should be contained in the blocks bloom filter.
 * @param {*} resCallback - The callback for the response.
 */
exports.generateProof = function (startTime, endTime, resCallback) {
  if (
    !startTime ||
    !endTime ||
    Object.keys(startTime).length === 0 ||
    Object.keys(endTime).length === 0
  ) {
    console.log("No start/end time was added to the request.");
    resCallback(400, "No start/end time was added to the request.");
    return;
  }

  if( startTime >= endTime ) {
    console.log(`Start time of ${startTime} is not before ${endTime}!`);
    resCallback(400, "Start time must be before end time!");
    return;
  }

  const callback = (prevHash) => {
    console.log("prevHash:", prevHash);
    // 3. create new block
    //  - get logs of [startTime, endTime] from elasticsearch
    //  - push logs into bloomfilter
    //  - add bloomfilter and startTime/endTime to data of new block
    const logsCallback = (logs) => {
      var logMsg = logs.logs.map(log => log._source);
      var bloom = BloomFilter.from(logMsg.map(log => JSON.stringify(log)), 0.05);
      var bloomJSON = JSON.stringify(bloom.saveAsJSON());

      var data = {
        startTime: startTime,
        endTime: endTime,
        bloom: bloomJSON,
      };

      var newInternalBlock = new internalBlock(
        new Date().toISOString(),
        data,
        prevHash
      );

      var newBlock = saveBlock(newInternalBlock);
      resCallback(200, newBlock);
    }

    getLogs(startTime, endTime, logsCallback);
  };

  // 1. try to get prev block
  // 2. if no prev block exists create genesis block
  getPrevHash(callback);
};

/**
 * Gets all logs from a specific time frame from elasticsearch.
 * 
 * @param {Date} startTime - start time for time frame.
 * @param {Date} endTime - end time for time frame.
 * @param {*} callback - The callback for the function.
 */
const getLogs = (startTime, endTime, callback) => {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          bool: {
            must: [
              {
                range: {
                  time: {
                    gte: startTime,
                    lte: endTime,
                  },
                },
              },
            ],
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching logs from elasticsearch.");
        throw err;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };
      
      callback(response);
    }
  );
}

/**
 * Gets the hash from the previous block in the chain.
 * If chain is empty a new genesis block is created.
 * 
 * @param {*} hashCallback - The callback from the function.
 */
const getPrevHash = (hashCallback) => {
  Block.findOne({}, {}, { sort: { "created_at":-1 } }, function(err, prevBlock) {
    if (err) {
      console.log("error while fetching prev block:", err);
      return "error while fetching prev block";
    }

    if (prevBlock == null) {
      console.log("No prev block! Creating new genesis block.")
      createGenesisBlock();
      // wait for creation of genesis block before recursive call
      return setTimeout(() => {
        getPrevHash(hashCallback);
      }, 1000);
    }

    hashCallback(prevBlock.hash);
  })
}

/**
 * Creates a new genesis block for the chain.
 */
const createGenesisBlock = () => {
  var time = new Date().toISOString();
  var data = {
    startTime: time,
    endTime: time,
    bloom: "Genesis block",
  };
  // the genesis block needs no PoW
  var genesisBlock = new internalBlock(new Date().toISOString(), data, "-", 0);
  saveBlock(genesisBlock);
}

/**
 * Saves a block in the MongoDB.
 * 
 * @param {*} internalBlock 
 */
function saveBlock(internalBlock) {
  const newBlock = new Block({
    timestamp: internalBlock.timestamp,
    prevHash: internalBlock.prevHash,
    nonce: internalBlock.nonce,
    data: {
      startTime: internalBlock.data.startTime,
      endTime: internalBlock.data.endTime,
      bloom: internalBlock.data.bloom,
    },
    hash: internalBlock.hash,
  });

  newBlock.save()
    .then((newBlock) => {
      console.log("added new block to chain:", newBlock);
      return newBlock;
    });
}
