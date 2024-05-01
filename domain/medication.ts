enum DoseStatus {
  Taken = "taken",
  Missed = "missed",
  Unknown = "unknown",
  Future = "future",
}

class DoseStatusWithTime {
  doseStatus: DoseStatus;
  date: Date;

  constructor(params: {
    doseStatus: DoseStatus,
    date: Date,
  }) {
    this.doseStatus = params.doseStatus;
    this.date = params.date;
  }

  toString(): string {
    return `${this.doseStatus} at ${this.date.toLocaleTimeString()} on ${this.date.toDateString()}`;
  }
}

class Medication {
    id: string;
    name: string;
    mgPerDose: number;
    mgPerTablet: number;
    timesOfDoses: Array<Date>;
    totalDoses: number;
    doseStatuses: Array<DoseStatus> = [];
    firstDoseIndex: number; // index of the first dose in the timesOfDoses array
  
    constructor(params: {
      id: string,
      name: string,
      mgPerDose: number,
      mgPerTablet: number,
      timesOfDoses: Array<Date>,
      totalDoses: number,
      dozeStatuses?: Array<DoseStatus>
      firstDoseIndex: number,
    }) {
      this.id = params.id;
      this.name = params.name;
      this.mgPerDose = params.mgPerDose;
      this.mgPerTablet = params.mgPerTablet;
      this.timesOfDoses = params.timesOfDoses;
      this.totalDoses = params.totalDoses;
      this.firstDoseIndex = params.firstDoseIndex;
      this.doseStatuses = params.dozeStatuses || Array(this.totalDoses).fill(DoseStatus.Future);

      console.log('Medication created:', this);
    }

    getPreviousStatusWithTime(): DoseStatusWithTime | null {
      const doseStatusesWithTime = this.getDoseStatusesWithTime();
      const now = new Date();

      for(let i = 0; i < doseStatusesWithTime.length; i++) {
        if(doseStatusesWithTime[i].date > now) {
          return i > 0 ? doseStatusesWithTime[i - 1] : null;
        }
      }

      return null;
    }

    getNextStatusWithTime(): DoseStatusWithTime | null {
      const doseStatusesWithTime = this.getDoseStatusesWithTime();
      const now = new Date();

      for(let i = 0; i < doseStatusesWithTime.length; i++) {
        if(doseStatusesWithTime[i].date > now) {
          return doseStatusesWithTime[i];
        }
      }

      return null;
    }

    getDoseStatusesWithTime(): Array<DoseStatusWithTime>{
      console.log('start getDoseStatusesWithTime firstDoseIndex:', this.firstDoseIndex, 'timesOfDoses:', this.timesOfDoses);
      const doseStatusesWithTime = [];
      let time = this.timesOfDoses[this.firstDoseIndex];
      let now = new Date();

      for(let doseIndex = 0; doseIndex < this.totalDoses; doseIndex++) {
        // iterate through the times of doses
        for(let timeIndex = 0; timeIndex < this.timesOfDoses.length; timeIndex++) {
          if(this.timesOfDoses[timeIndex].isEqualDate(time) && (this.timesOfDoses[timeIndex] < time)){
            console.log('day is ', this.timesOfDoses[timeIndex].getDate());
            console.log('time day is ', time.getDate());
            console.log('time is ', time);
            console.log('skipping dose', doseIndex, this.timesOfDoses[timeIndex], time);
            break; // first dose could be latter in the day
          }

          let doseStatus = this.doseStatuses[doseIndex];

          // If dose is in the past and status is future, update status to unknown
          if(time < now && doseStatus === DoseStatus.Future) {
            doseStatus = DoseStatus.Unknown;
          }

          const doseStatusWithTime = new DoseStatusWithTime({
            doseStatus: doseStatus,
            date: time,
          });
          doseStatusesWithTime.push(doseStatusWithTime);
          console.log(doseStatusWithTime);
          
          // If more dose times on same day update the time to be the same date, but have the hours and minutes of the next dose
          if(timeIndex + 1 < this.timesOfDoses.length) {
            time = this.updateTime(time, this.timesOfDoses[timeIndex + 1]);
          } else {
            time = this.updateTime(time, null);
          }
        }
      }

      return doseStatusesWithTime;
    }

    private setTime = (date: Date, hours: number, minutes: number): Date => {
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      return newDate;
    };

    // Update time based on the next dose time
    private updateTime = (currentDate: Date, nextDoseTime: Date | null): Date => {
      if (nextDoseTime) {
        return this.setTime(currentDate, nextDoseTime.getHours(), nextDoseTime.getMinutes());
      } else {
        // If no more dose times on the same day, update the time to be the next day with the hours and minutes of the first dose
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return this.setTime(nextDay, this.timesOfDoses[0].getHours(), this.timesOfDoses[0].getMinutes());
      }
    };
  }

  declare global {
    interface Date {
      isEqualDate(otherDate: Date): boolean;
    }
  }
  
  Date.prototype.isEqualDate = function(otherDate: Date): boolean {
    return (
      this.getFullYear() === otherDate.getFullYear() &&
      this.getMonth() === otherDate.getMonth() &&
      this.getDate() === otherDate.getDate()
    );
  };

export default Medication;
  