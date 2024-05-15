export enum DoseStatusType {
  Taken = "taken",
  Missed = "missed",
  Unknown = "unknown",
  Future = "future",
}

class DoseStatus {
  type: DoseStatusType;
  index: number;
  date?: Date;

  constructor(params: { type: DoseStatusType; index: number, date?: Date }) {
    this.type = params.type;
    this.index = params.index;
    this.date = params.date;
  }

  static future(index: number): DoseStatus {
    return new DoseStatus({ type: DoseStatusType.Future, index: index });
  }

  // print type and date of the dose status
  toString(): string {
    return `${this.type} ${this.date}`;
  }

  toJSON(): any {
    return {
      type: this.type,
      index: this.index,
      date: this.date?.toISOString()
    };
  }

  static fromJSON(json: any): DoseStatus {
    return new DoseStatus({
      type: json.type,
      index: json.index,
      date: json.date ? new Date(json.date) : undefined
    });
  }
}

const setTime = (date: Date, hours: number, minutes: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  return newDate;
};

// Update time based on the next dose time
const updateTime = (currentDate: Date, nextDoseTime: Date | null, timesOfDoses: Array<Date>): Date => {
  if (nextDoseTime) {
    return setTime(
      currentDate,
      nextDoseTime.getHours(),
      nextDoseTime.getMinutes()
    );
  } else {
    // If no more dose times on the same day, update the time to be the next day with the hours and minutes of the first dose
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return setTime(
      nextDay,
      timesOfDoses[0].getHours(),
      timesOfDoses[0].getMinutes()
    );
  }
};

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
      console.log("Dose statuses are provided as ", params.doseStatuses);
      this.doseStatuses = params.doseStatuses;
    } else {
      console.log("Dose statuses are not provided, total doses is ", params.totalDoses);
      console.log("type of total doses is ", typeof(params.totalDoses));
      this.doseStatuses = [];
      for(let i = 0; i < params.totalDoses!; i++){
        this.doseStatuses.push(DoseStatus.future(i));
      }

      console.log("Dose statuses are ", this.doseStatuses, "dose statuses length is ", this.doseStatuses.length);
    }

    console.log("Medication created:", this);
  }

  getPreviousStatusWithTime(): DoseStatus | null {
    const doseStatusesWithTime = this.getDoseStatusesWithTime();
    const now = new Date();

    for (let i = 0; i < doseStatusesWithTime.length; i++) {
      if (doseStatusesWithTime[i].date! > now) {
        return i > 0 ? doseStatusesWithTime[i - 1] : null;
      }
    }

    return null;
  }

  getNextStatusWithTime(): DoseStatus | null {
    const doseStatusesWithTime = this.getDoseStatusesWithTime();
    const now = new Date();

    for (let i = 0; i < doseStatusesWithTime.length; i++) {
      if (doseStatusesWithTime[i].date! > now) {
        return doseStatusesWithTime[i];
      }
    }

    return null;
  }

  getDoseStatusesWithTime(): Array<DoseStatus> {
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
        if (time < now && doseStatus.type === DoseStatusType.Future) {
          doseStatus.type = DoseStatusType.Unknown;
        }

        const doseStatusWithTime = new DoseStatus({
          type: doseStatus.type,
          index: doseStatus.index,
          date: time,
        });

        doseStatusesWithTime.push(doseStatusWithTime);

        // If more dose times on same day update the time to be the same date, but have the hours and minutes of the next dose
        if (timeIndex + 1 < this.timesOfDoses.length) {
          time = updateTime(time, this.timesOfDoses[timeIndex + 1], this.timesOfDoses);
        } else {
          time = updateTime(time, null, this.timesOfDoses);
        }
      }
    }

    return doseStatusesWithTime;
  }
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

export { DoseStatus };

export default Medication;
