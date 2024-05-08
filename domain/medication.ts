enum DoseStatus {
  Taken = "taken",
  Missed = "missed",
  Unknown = "unknown",
  Future = "future",
}

class DoseStatusWithTime {
  doseStatus: DoseStatus;
  date: Date;

  constructor(params: { doseStatus: DoseStatus; date: Date }) {
    this.doseStatus = params.doseStatus;
    this.date = params.date;
  }

  toString(): string {
    return `${
      this.doseStatus
    } at ${this.date.toLocaleTimeString()} on ${this.date.toDateString()}`;
  }
}

class Medication {
  id?: number;
  name: string;
  mgPerDose: number;
  mgPerTablet: number;
  timesOfDoses: Array<Date>;
  doseStatuses: Array<DoseStatus>;
  firstDoseIndex: number; 

  constructor(params: {
    id?: number;
    name: string;
    mgPerDose: number;
    mgPerTablet: number;
    timesOfDoses: Array<Date>;
    totalDoses?: number;
    doseStatuses?: Array<DoseStatus>;
    firstDoseIndex: number;
  }) {

    // print the types of the parameters
    console.log("id is ", typeof(params.id));
    console.log("name is ", typeof(params.name));
    console.log("mgPerDose is ", typeof(params.mgPerDose));
    console.log("mgPerTablet is ", typeof(params.mgPerTablet));
    console.log("timesOfDoses is ", typeof(params.timesOfDoses));
    console.log("totalDoses is ", typeof(params.totalDoses), "totalDoses ", params.totalDoses);
    console.log("doseStatuses is ", typeof(params.doseStatuses), "doseStatuses ", params.doseStatuses);
    console.log("firstDoseIndex is ", typeof(params.firstDoseIndex));

    this.id = params.id;
    this.name = params.name;
    this.mgPerDose = params.mgPerDose;
    this.mgPerTablet = params.mgPerTablet;
    this.timesOfDoses = params.timesOfDoses;
    this.firstDoseIndex = params.firstDoseIndex;
  

    if (!params.totalDoses && !params.doseStatuses) {
      throw new Error("Both totalDoses and doseStatuses are undefined.");
    }

    if(params.doseStatuses !== undefined){
      console.log("Dose statuses are provided");
      this.doseStatuses = params.doseStatuses;
    } else {
      console.log("Dose statuses are not provided, total doses is ", params.totalDoses);
      console.log("type of total doses is ", typeof(params.totalDoses));
      this.doseStatuses = Array<DoseStatus>(params.totalDoses!).fill(DoseStatus.Future);
      console.log("Dose statuses are ", this.doseStatuses, "dose statuses length is ", this.doseStatuses.length);
    }

    console.log("Medication created:", this);
  }

  getPreviousStatusWithTime(): DoseStatusWithTime | null {
    const doseStatusesWithTime = this.getDoseStatusesWithTime();
    const now = new Date();

    for (let i = 0; i < doseStatusesWithTime.length; i++) {
      if (doseStatusesWithTime[i].date > now) {
        return i > 0 ? doseStatusesWithTime[i - 1] : null;
      }
    }

    return null;
  }

  getNextStatusWithTime(): DoseStatusWithTime | null {
    const doseStatusesWithTime = this.getDoseStatusesWithTime();
    const now = new Date();

    for (let i = 0; i < doseStatusesWithTime.length; i++) {
      if (doseStatusesWithTime[i].date > now) {
        return doseStatusesWithTime[i];
      }
    }

    return null;
  }

  getDoseStatusesWithTime(): Array<DoseStatusWithTime> {
    const doseStatusesWithTime = [];
    let time = this.timesOfDoses[this.firstDoseIndex];
    let now = new Date();

    for (let doseIndex = 0; doseIndex < this.doseStatuses.length; doseIndex++) {
      // iterate through the times of doses
      for (
        let timeIndex = 0;
        timeIndex < this.timesOfDoses.length;
        timeIndex++
      ) {
        if (
          this.timesOfDoses[timeIndex].isEqualDate(time) &&
          this.timesOfDoses[timeIndex] < time
        ) {
          console.log("day is ", this.timesOfDoses[timeIndex].getDate());
          console.log("time day is ", time.getDate());
          console.log("time is ", time);
          console.log(
            "skipping dose",
            doseIndex,
            this.timesOfDoses[timeIndex],
            time
          );
          break; // first dose could be latter in the day
        }

        let doseStatus = this.doseStatuses[doseIndex];

        // If dose is in the past and status is future, update status to unknown
        if (time < now && doseStatus === DoseStatus.Future) {
          doseStatus = DoseStatus.Unknown;
        }

        const doseStatusWithTime = new DoseStatusWithTime({
          doseStatus: doseStatus,
          date: time,
        });
        doseStatusesWithTime.push(doseStatusWithTime);
        console.log(doseStatusWithTime);

        // If more dose times on same day update the time to be the same date, but have the hours and minutes of the next dose
        if (timeIndex + 1 < this.timesOfDoses.length) {
          time = this.updateTime(time, this.timesOfDoses[timeIndex + 1]);
        } else {
          time = this.updateTime(time, null);
        }
      }
    }

    return doseStatusesWithTime;
  }

  setTime = (date: Date, hours: number, minutes: number): Date => {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
  };

  // Update time based on the next dose time
  updateTime = (currentDate: Date, nextDoseTime: Date | null): Date => {
    if (nextDoseTime) {
      return this.setTime(
        currentDate,
        nextDoseTime.getHours(),
        nextDoseTime.getMinutes()
      );
    } else {
      // If no more dose times on the same day, update the time to be the next day with the hours and minutes of the first dose
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return this.setTime(
        nextDay,
        this.timesOfDoses[0].getHours(),
        this.timesOfDoses[0].getMinutes()
      );
    }
  };
}

declare global {
  interface Date {
    isEqualDate(otherDate: Date): boolean;
  }
}

Date.prototype.isEqualDate = function (otherDate: Date): boolean {
  return (
    this.getFullYear() === otherDate.getFullYear() &&
    this.getMonth() === otherDate.getMonth() &&
    this.getDate() === otherDate.getDate()
  );
};

export { DoseStatus, DoseStatusWithTime };

export default Medication;
