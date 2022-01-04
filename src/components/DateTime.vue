<template>
  <div class="date-time">{{ dateTime }}</div>
</template>

<script>
import moment from "moment";
import { declensionWords } from "@/utils/declensionWords";

export default {
  data() {
    return {
      dateTime: null,
      interval: null,
      minutesWords: ["минута", "минуты", "минут"],
      hoursWords: ["час", "часа", "часов"],
    };
  },

  props: {
    date: Number,
  },

  methods: {
    setDateTime() {
      let secondsAgo = moment().diff(this.date * 1000, "seconds");

      let minutesAgo = moment().diff(this.date * 1000, "minutes");

      let hoursAgo = moment().diff(this.date * 1000, "hours");

      let currentDay = moment().format("DD");

      let srcDay = moment(this.date * 1000).format("DD");

      let currentMonth = moment().format("MM");

      let srcMonth = moment(this.date * 1000).format("MM");

      let currentYear = moment().year();

      let srcYear = moment(this.date * 1000).year();

      let time = moment(this.date * 1000).format("HH:mm");

      let shortDate = moment(this.date * 1000).format("DD.MM");

      let fullDate = moment(this.date * 1000).format("DD.MM.YY");

      if (currentYear == srcYear) {
        if (currentMonth == srcMonth) {
          if (currentDay == srcDay) {
            if (secondsAgo >= 0 && secondsAgo <= 60) {
              this.dateTime = "только что";
            } else if (secondsAgo > 60 && secondsAgo <= 3600) {
              this.dateTime =
                minutesAgo +
                " " +
                declensionWords(minutesAgo, this.minutesWords);
            } else if (secondsAgo > 3600 && secondsAgo <= 86400) {
              if (secondsAgo <= 18000) {
                this.dateTime =
                  hoursAgo + " " + declensionWords(hoursAgo, this.hoursWords);
              } else if (secondsAgo > 18000) {
                this.dateTime = time;
              }
            }
          } else if (currentDay - 1 == srcDay) {
            this.dateTime = "вчера";
          }
        } else {
          this.dateTime = shortDate;
        }
      } else {
        this.dateTime = fullDate;
      }
    },
  },

  mounted() {
    this.setDateTime();
    this.interval = setInterval(this.setDateTime, 60000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<style>
</style>