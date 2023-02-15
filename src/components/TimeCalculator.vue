<template>
  <v-app>
    <v-main>
      <v-toolbar app color="blue darken-4" dark>
        <v-toolbar-side-icon class="hidden-md-and-up" ></v-toolbar-side-icon>
        <v-spacer class="hidden-md-and-up"></v-spacer>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-btn flat class="hidden-sm-and-down">SIGN IN</v-btn>
        <v-btn color="brown lighten-3" class="hidden-sm-and-down">JOIN</v-btn>
      </v-toolbar>
      <v-container fluid fill-height class="home-hero">
        <v-card
          class="mx-auto my-8"
          max-width="874"
        >
          <v-card-title>Track Here</v-card-title>
          <v-card-item>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field label="Start Time" type="time" v-model="start"></v-text-field>
              <v-subheader>
                Lunch Break
              </v-subheader>
              <v-row align="center">
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="Lunch Start" type="time" v-model="lunchStart"></v-text-field>
                </v-col>

                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    label="Lunch End"
                    type="time"
                    v-model="lunchEnd"
                    :rules="rules"
                    lazy-rules
                  ></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="Manual Time" type="text" v-model="lunchManualTime" :disabled="hideLunchManualTime" placeholder="Minutes"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-btn
                  class="rounded"
                  color="blue darken-1"
                  dark
                  @click="addBreaks"
                >
                  <v-icon
                    dark
                    left
                  >
                    mdi-plus-circle
                  </v-icon>Add Breaks
                </v-btn>
              </v-row>
              <v-row align="center" v-if="firstBreak">
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="First Break Start" type="time" v-model="firstBreakStart" ></v-text-field>
                </v-col>

                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="First Break End" type="time" v-model="firstBreakEnd" :rules="rules"></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="3"
                >
                  <v-text-field label="First Manual Time" type="text" v-model="firstBreakManualTime" :disabled="hideFirstBreakManualTime" placeholder="Minutes"></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="1"
                >
                  <v-icon color="red" class="mb-4" @click="removeFirst">
                    mdi-delete
                  </v-icon>
                </v-col>
              </v-row>
              <v-row align="center" v-if="secondBreak">
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="Second Break Start" type="time" v-model="secondBreakStart" ></v-text-field>
                </v-col>

                <v-col
                  class="d-flex"
                  cols="12"
                  sm="4"
                >
                  <v-text-field label="Second Break End" type="time" v-model="secondBreakEnd" :rules="rules"></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="3"
                >
                  <v-text-field label="Second Manual Time" type="text" v-model="secondBreakManualTime" :disabled="hideSecondBreakManualTime" placeholder="Minutes"></v-text-field>
                </v-col>
                <v-col
                  class="d-flex"
                  cols="12"
                  sm="1"
                >
                  <v-icon color="red" class="mb-4" @click="removeSecond">
                    mdi-delete
                  </v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-text-field label="End Time" type="time" v-model="end" class="my-2"></v-text-field>
              </v-row>
              <v-btn
                color="success"
                class="mr-4"
                @click="validate"
                :disabled="!valid"
              >
                Calculate
              </v-btn>
              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                Reset
              </v-btn>
              <v-btn color="primary" :disabled="!valid"  @click="copyTemplate">Copy Template</v-btn>
            </v-form>
          </v-card-item>
          <v-card-text class="pb-0" v-if="totalWorkingTime" >Total Time : {{ totalTime }}</v-card-text>
          <v-footer padless>
            <v-col
              :class="totalTimeColor"
              v-if="totalWorkingTime"
              class="my-3 rounded text-center"
              cols="12"
            >
              <h3 >
                Your Total Working Time Is: {{ totalWorkingTime }} Hours
              </h3>
            </v-col>
          </v-footer>
          <v-card-item v-show="totalWorkingTime" id="template">
            <p>Day Start Time: {{ start }} AM</p>
            <p>Lunch Time: {{ totalLunchTime }}</p>
            <p>Break: {{ totalBreakTime }}</p>
            <p>Day End Time: {{ end }} PM</p>
            <p>Today's Hour On Desk: (time) {{ totalWorkingTime }}</p>
            <p>Today's Total Hours: {{ totalTime }}</p>
          </v-card-item>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import moment from 'moment'

const title = ref('Track Your Time');
const start = ref('');
const end = ref(moment().format('HH:mm'));
const totalWorkingTime = ref('');
const totalBreakTime = ref('');
const totalLunchTime = ref('');
const totalTime = ref('');
const lunchStart = ref(0);
const lunchEnd = ref(0);
const lunchManualTime = ref('');
const totalTimeColor = ref('');
const rules = ref([]);

//First Break
const firstBreak = ref(false);
const firstBreakStart = ref('');
const firstBreakEnd = ref('');
const firstBreakManualTime = ref('');

//Second Break
const secondBreak = ref(false);
const secondBreakStart = ref('');
const secondBreakEnd = ref('');
const secondBreakManualTime = ref('');

const valid = computed(() => start.value.length > 0 && end.value.length > 0 && rules.value.length<1 && start.value < end.value)
const hideLunchManualTime = computed(() => lunchStart.value.length >0 && lunchEnd.value.length >0)
const hideFirstBreakManualTime = computed(() => firstBreakStart.value.length >0 && firstBreakEnd.value.length >0)
const hideSecondBreakManualTime = computed(() => secondBreakStart.value.length >0 && secondBreakEnd.value.length >0)

watch([lunchStart, lunchEnd], (newValue) => {
  let start = getManualTimeInMinute(newValue[0]);
  let end = getManualTimeInMinute(newValue[1]);
  lunchStart.value = newValue[0]
  lunchEnd.value = newValue[1]
  rules.value = [];
  if (start >= end) {
    rules.value = ['Please select greater start time'];
  }
})

watch(firstBreakEnd, (newValue) => {
  let start = getManualTimeInMinute(firstBreakStart.value);
  let end = getManualTimeInMinute(newValue);
  rules.value = [];
  if (end <= start) {
    rules.value = ['Please select greater start time'];
  }
})

watch(secondBreakEnd, (newValue) => {
  let start = getManualTimeInMinute(secondBreakStart.value);
  let end = getManualTimeInMinute(newValue);
  rules.value = [];
  if (end <= start) {
    rules.value = ['Please select greater start time'];
  }
})

function copyTemplate () {
  let textToCopy = document.getElementById('template');
  console.log('data', textToCopy);
  textToCopy.select()
  document.execCommand("copy");
}

function validate() {
  let totalLunchMinute = 0;
  let totalFirstBreakMinute = 0;
  let totalSecondBreakMinute = 0;

  if (lunchStart.value.length > 0 && lunchEnd.value.length > 0 ) {
    totalLunchMinute = getTimeInMinute(lunchStart, lunchEnd);
  }

  if (firstBreakStart.value.length > 0 && firstBreakEnd.value.length > 0 ) {
    totalFirstBreakMinute = getTimeInMinute(firstBreakStart, firstBreakEnd);
  }

  if (secondBreakStart.value.length > 0 && secondBreakEnd.value.length > 0 ) {
    totalSecondBreakMinute = getTimeInMinute(secondBreakStart, secondBreakEnd);
  }

  if (lunchManualTime.value.length > 0) {
    totalLunchMinute = lunchManualTime.value;
  }

  if (firstBreakManualTime.value.length > 0) {
    totalFirstBreakMinute = firstBreakManualTime.value;
  }

  if (secondBreakManualTime.value.length > 0) {
    totalSecondBreakMinute = secondBreakManualTime.value;
  }

  const startTime = moment(start.value, 'hh:mm');
  const endTime = moment(end.value, 'hh:mm');
  const totalMinute = endTime.diff(startTime, 'minutes');
  const timeIs = totalMinute - totalLunchMinute - totalFirstBreakMinute - totalSecondBreakMinute;
  const allBreakTime = totalFirstBreakMinute + totalSecondBreakMinute;
  totalBreakTime.value = Math.floor(allBreakTime/60) + ':' + allBreakTime%60;
  totalLunchTime.value = Math.floor(totalLunchMinute/60) + ':' + totalLunchMinute%60;
  totalWorkingTime.value = Math.floor(timeIs/60) + ':' + timeIs%60;
  totalTime.value = Math.floor(totalMinute/60) + ':' + totalMinute%60;
  totalTimeColor.value = timeIs >= 480 ? "bg-green" : ((timeIs >= 360 && timeIs <= 479 ) ? "bg-yellow" : "bg-cyan accent-2");
}

function getTimeInMinute (startTime, endTime) {
  startTime = moment(startTime.value, 'hh:mm');
  endTime = moment(endTime.value, 'hh:mm');
  return endTime.diff(startTime, 'minutes');
}

function getManualTimeInMinute (manualTime) {
  const value = moment(manualTime, 'hh:mm');
  return moment.duration(value.format("HH:mm")).asMinutes()
}

function reset() {
  start.value = '';
  end.value = '';
  lunchStart.value = 0;
  lunchEnd.value = 0;
  lunchManualTime.value = '';
  totalWorkingTime.value = '';
  totalTimeColor.value = '';
  removeFirst();
  removeSecond();
}

function addBreaks() {
  secondBreak.value = firstBreak.value === true;
  firstBreak.value = true;
}

function removeFirst() {
  firstBreak.value = false;
  firstBreakStart.value = '';
  firstBreakEnd.value = '';
  firstBreakManualTime.value = '';
}

function removeSecond() {
  secondBreak.value = false;
  secondBreakStart.value = '';
  secondBreakEnd.value = '';
  secondBreakManualTime.value = '';
}
</script>
<style scoped>

</style>