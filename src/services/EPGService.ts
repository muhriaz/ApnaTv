import axios, { AxiosInstance } from "axios";
import xml2js from "xml2js";

export interface EPGChannel {
  id: string;
  displayName: string;
  icon?: string;
  url?: string;
}

export interface EPGProgram {
  id?: string;
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  rating?: number;
}

export interface ChannelSchedule {
  channel: EPGChannel;
  programs: EPGProgram[];
}

export class EPGService {
  private client: AxiosInstance;
  private xmlParser = new xml2js.Parser();

  constructor() {
    this.client = axios.create({
      timeout: 30000,
    });
  }

  /**
   * Fetch and parse EPG from URL
   */
  async fetchEPG(epgUrl: string): Promise<ChannelSchedule[]> {
    try {
      const response = await this.client.get(epgUrl);
      return await this.parseEPGXML(response.data);
    } catch (error) {
      console.error("Error fetching EPG:", error);
      throw new Error("Failed to fetch EPG data");
    }
  }

  /**
   * Parse XMLTV format EPG
   */
  private async parseEPGXML(xmlContent: string): Promise<ChannelSchedule[]> {
    try {
      const result = await this.xmlParser.parseStringPromise(xmlContent);
      const tv = result.tv;

      if (!tv) {
        throw new Error("Invalid EPG XML format");
      }

      const schedules: ChannelSchedule[] = [];
      const channelMap = new Map<string, EPGChannel>();

      // Parse channels
      if (tv.channel) {
        for (const channel of tv.channel) {
          const epgChannel: EPGChannel = {
            id: channel.$.id,
            displayName: channel["display-name"]?.[0] || "",
            icon: channel.icon?.[0]?.$.src,
            url: channel.url?.[0],
          };
          channelMap.set(epgChannel.id, epgChannel);
        }
      }

      // Parse programs
      if (tv.programme) {
        for (const prog of tv.programme) {
          const channelId = prog.$.channel;
          const channel = channelMap.get(channelId);

          if (!channel) {
            continue;
          }

          const program: EPGProgram = {
            channel: channelId,
            start: this.parseDate(prog.$.start),
            stop: this.parseDate(prog.$.stop),
            title: prog.title?.[0] || "",
            description: prog.desc?.[0],
            category: prog.category?.[0],
            icon: prog.icon?.[0]?.$.src,
          };

          let schedule = schedules.find((s) => s.channel.id === channelId);
          if (!schedule) {
            schedule = {
              channel,
              programs: [],
            };
            schedules.push(schedule);
          }

          schedule.programs.push(program);
        }
      }

      return schedules;
    } catch (error) {
      console.error("Error parsing EPG XML:", error);
      throw new Error("Failed to parse EPG XML");
    }
  }

  /**
   * Parse XMLTV date format
   */
  private parseDate(dateStr: string): Date {
    // Format: 20230101000000 +0000
    if (!dateStr) return new Date();

    const parts = dateStr.split(" ");
    const dateTime = parts[0];

    const year = parseInt(dateTime.substring(0, 4), 10);
    const month = parseInt(dateTime.substring(4, 6), 10);
    const day = parseInt(dateTime.substring(6, 8), 10);
    const hours = parseInt(dateTime.substring(8, 10), 10);
    const minutes = parseInt(dateTime.substring(10, 12), 10);
    const seconds = parseInt(dateTime.substring(12, 14), 10);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  /**
   * Get current program on channel
   */
  getCurrentProgram(
    schedule: ChannelSchedule,
    now: Date = new Date(),
  ): EPGProgram | null {
    return (
      schedule.programs.find((prog) => prog.start <= now && now <= prog.stop) ||
      null
    );
  }

  /**
   * Get next program on channel
   */
  getNextProgram(
    schedule: ChannelSchedule,
    now: Date = new Date(),
  ): EPGProgram | null {
    return schedule.programs.find((prog) => prog.start > now) || null;
  }

  /**
   * Get programs for channel within time range
   */
  getProgramsInRange(
    schedule: ChannelSchedule,
    start: Date,
    end: Date,
  ): EPGProgram[] {
    return schedule.programs.filter(
      (prog) =>
        (prog.start >= start && prog.start < end) ||
        (prog.stop > start && prog.stop <= end) ||
        (prog.start < start && prog.stop > end),
    );
  }

  /**
   * Search programs across all channels
   */
  searchPrograms(schedules: ChannelSchedule[], query: string): EPGProgram[] {
    const results: EPGProgram[] = [];
    const lowerQuery = query.toLowerCase();

    for (const schedule of schedules) {
      for (const program of schedule.programs) {
        if (
          program.title.toLowerCase().includes(lowerQuery) ||
          program.description?.toLowerCase().includes(lowerQuery)
        ) {
          results.push(program);
        }
      }
    }

    return results;
  }
}

export default new EPGService();
