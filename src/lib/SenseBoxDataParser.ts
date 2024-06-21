import {
  senseBoxDataRecord,
  useSenseBoxValuesStore,
} from "./store/useSenseBoxValuesStore";

export class SenseBoxDataParser {
  private static instance: SenseBoxDataParser;

  private dataBuffer: senseBoxDataRecord[] = [];
  private timestampInterval: number;

  constructor(interval: number) {
    this.timestampInterval = interval;
  }

  // Singleton
  static getInstance(interval: number) {
    if (!SenseBoxDataParser.instance) {
      SenseBoxDataParser.instance = new SenseBoxDataParser(interval);
    }

    const instance = SenseBoxDataParser.instance;
    instance.setTimestampInterval(interval);
    return instance;
  }

  getTimestampInterval() {
    return this.timestampInterval;
  }

  setTimestampInterval(interval: number) {
    this.timestampInterval = interval;
  }

  async checkCompleteData() {
    if (this.dataBuffer.length < 5) return;

    // merge the data by timestamp
    const buckets = this.dataBuffer
      .reduce((acc, record) => {
        const { timestamp, ...data } = record;

        // check if there is already a record with similar timestamp
        const existingTimestamp = acc.find(
          (e) =>
            Math.abs(new Date(e.timestamp).getTime() - timestamp.getTime()) <
            this.timestampInterval
        ); // 5 seconds

        // add new record or update existing one
        if (!existingTimestamp) {
          acc.push({ timestamp, ...data });
        } else {
          const existingIndex = acc.indexOf(existingTimestamp);
          acc[existingIndex] = {
            ...existingTimestamp,
            ...data,
          };
        }

        return acc;
      }, [] as senseBoxDataRecord[])
      .filter(
        (b) =>
          b.temperature !== undefined &&
          b.ph !== undefined &&
          b.ec !== undefined &&
          b.turbidity !== undefined
      );

    // // filter out all records that are inside the exclusion zone
    // const filteredRecords = buckets.filter(
    //   record => !isInExclusionZone(point([record.gps_lng!, record.gps_lat!])),
    // )

    const completeTimestamps = buckets.map((b) => b.timestamp);

    // remove all data that is already complete
    this.dataBuffer = this.dataBuffer.filter(
      (d) =>
        !completeTimestamps.some(
          (t) =>
            Math.abs(t.getTime() - d.timestamp.getTime()) <
            this.timestampInterval
        )
    );
  }

  pushData(data: Omit<senseBoxDataRecord, "timestamp">) {
    this.dataBuffer.push({
      ...data,
      timestamp: new Date(),
    });

    this.checkCompleteData();
  }
}
