export default {
  /**
   * Opens error toast.
   *
   * @param {string} message The message that should be shown.
   */
  openFailedToast(message) {
    this.$buefy.toast.open({
      duration: 4000,
      message: message,
      position: "is-bottom",
      type: "is-danger",
      queue: false,
    });
  },
  /**
   * Opens success toast.
   *
   * @param {string} message The message that should be shown.
   */
  openSuccessToast(message) {
    this.$buefy.toast.open({
      duration: 4000,
      message: message,
      position: "is-top",
      type: "is-success",
      queue: false,
    });
  },
};