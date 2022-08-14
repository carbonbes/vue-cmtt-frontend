<template>
  <div class="date-time" v-text="dateTime"></div>
</template>

<script>
import moment from "moment";
import wordDeclension from "@/utils/wordDeclension";

export default {
  data() {
    return {
      dateTime: null,
      interval: null,
      months: [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ],
      minutesWords: ["минута", "минуты", "минут"],
      hoursWords: ["час", "часа", "часов"],
    };
  },

  props: {
    date: [String, Number],
    type: String,
  },

  methods: {
    setDateTime() {
      let secondsAgo = moment().diff(this.date, "seconds");

      let minutesAgo = moment().diff(this.date, "minutes");

      let hoursAgo = moment().diff(this.date, "hours");

      let currentDay = moment().format("DD");

      let srcDay = moment(this.date).format("DD");

      let srcDatWithoutZero = moment(this.date).format("D");

      let currentMonth = moment().format("MM");

      let srcMonth = moment(this.date).format("MM");

      let srcMonthWithoutZero = moment(this.date).format("M");

      let currentYear = moment().year();

      let srcYear = moment(this.date).year();

      let time = moment(this.date).format("HH:mm");

      let shortDate = moment(this.date).format("DD.MM");

      let shortDateWithMonth =
        srcDatWithoutZero + " " + this.months[srcMonthWithoutZero - 1];

      let fullDate = moment(this.date).format("DD.MM.YY");

      if (currentYear == srcYear) {
        if (currentMonth == srcMonth) {
          if (currentDay == srcDay) {
            if (secondsAgo < 60) {
              this.dateTime = "только что";
            } else if (secondsAgo >= 60 && secondsAgo <= 3600) {
              if (this.type === "0") {
                this.dateTime = minutesAgo + " мин";
              } else {
                this.dateTime =
                  minutesAgo +
                  " " +
                  wordDeclension(minutesAgo, this.minutesWords) +
                  " назад";
              }
            } else if (secondsAgo > 3600 && secondsAgo <= 86400) {
              if (secondsAgo <= 18000) {
                this.dateTime =
                  hoursAgo + " " + wordDeclension(hoursAgo, this.hoursWords);
              } else if (secondsAgo > 18000) {
                if (this.type === "0") {
                  this.dateTime = time;
                } else if (this.type === "1") {
                  this.dateTime = "сегодня в " + time;
                }
              }
            }
          } else if (currentDay - 1 == srcDay) {
            if (this.type === "0") {
              this.dateTime = "вчера";
            } else if (this.type === "1") {
              this.dateTime = "вчера в " + time;
            }
          } else {
            this.dateTime = shortDateWithMonth;
          }
        } else if (currentMonth - srcMonth === 1) {
          this.dateTime = shortDateWithMonth;
        } else {
          this.dateTime = fullDate;
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
    this.dateTime = null;
  },
};
</script>

<style>
</style>