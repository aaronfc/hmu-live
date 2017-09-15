import { API_ENDPOINT } from './config';

export const api = {

    public: () => ({
      like: () => {
          fetch(
            API_ENDPOINT + "/like",
            {method: "POST"}
          ).then(() => console.log("Like sent!"));
      },

      dislike: () => {
          fetch(
            API_ENDPOINT + "/dislike",
            {method: "POST"}
          ).then(() => console.log("Dislike sent!"));
      }
    }),

    private: (apiKey) => ({
      start: () => {
          fetch(
            API_ENDPOINT + "/start",
            {
              method: "POST",
              headers: { Authentication: apiKey }
            }
          ).then(() => console.log("Start sent!"));
      },

      stop: () => {
          fetch(
            API_ENDPOINT + "/stop",
            {
              method: "POST",
              headers: { Authentication: apiKey }
            }
          ).then(() => console.log("Stop sent!"));
      },

      pause: () => {
          fetch(
            API_ENDPOINT + "/pause",
            {
              method: "POST",
              headers: { Authentication: apiKey }
            }
          ).then(() => console.log("Pause sent!"));
      },

      results: (callback) => {
          fetch(
            API_ENDPOINT + "/results",
            {
              method: "GET",
              headers: { Authentication: apiKey }
            }
          ).then(d => d.json()).then(callback);
      },

      resume: () => {
          fetch(
            API_ENDPOINT + "/resume",
            {
              method: "POST",
              headers: { Authentication: apiKey }
            }
          ).then(() => console.log("Resume sent!"));
      }
    })
}
