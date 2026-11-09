export interface RecordingSettings {
  duration: number; // in minutes
  quality: "SD" | "HD" | "4K";
  format: "MP4" | "MKV" | "TS";
}

export interface Recording {
  id: string;
  streamId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  quality: string;
  format: string;
  filePath: string;
  status: "pending" | "recording" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export class RecordingService {
  private recordings: Map<string, Recording> = new Map();
  private activeRecordings: Set<string> = new Set();

  /**
   * Start recording a stream
   */
  startRecording(
    streamId: string,
    title: string,
    duration: number,
    settings: RecordingSettings,
  ): Recording {
    const recording: Recording = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      streamId,
      title,
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60000),
      duration,
      quality: settings.quality,
      format: settings.format,
      filePath: this.generateFilePath(title, settings.format),
      status: "pending",
      createdAt: new Date(),
    };

    this.recordings.set(recording.id, recording);
    this.activeRecordings.add(recording.id);

    // Simulate recording start
    setTimeout(() => {
      const rec = this.recordings.get(recording.id);
      if (rec && this.activeRecordings.has(recording.id)) {
        rec.status = "recording";
      }
    }, 1000);

    // Simulate recording completion
    setTimeout(
      () => {
        const rec = this.recordings.get(recording.id);
        if (rec && this.activeRecordings.has(recording.id)) {
          rec.status = "completed";
          rec.completedAt = new Date();
          this.activeRecordings.delete(recording.id);
        }
      },
      duration * 60000 + 1000,
    );

    return recording;
  }

  /**
   * Stop recording
   */
  stopRecording(recordingId: string): Recording | null {
    const recording = this.recordings.get(recordingId);
    if (!recording) {
      return null;
    }

    if (recording.status === "recording" || recording.status === "pending") {
      recording.status = "completed";
      recording.completedAt = new Date();
      this.activeRecordings.delete(recordingId);
    }

    return recording;
  }

  /**
   * Get recording by ID
   */
  getRecording(recordingId: string): Recording | null {
    return this.recordings.get(recordingId) || null;
  }

  /**
   * Get all recordings
   */
  getAllRecordings(): Recording[] {
    return Array.from(this.recordings.values());
  }

  /**
   * Get active recordings
   */
  getActiveRecordings(): Recording[] {
    return Array.from(this.activeRecordings.values())
      .map((id) => this.recordings.get(id))
      .filter((rec): rec is Recording => rec !== undefined);
  }

  /**
   * Get completed recordings
   */
  getCompletedRecordings(): Recording[] {
    return Array.from(this.recordings.values()).filter(
      (rec) => rec.status === "completed",
    );
  }

  /**
   * Delete recording
   */
  deleteRecording(recordingId: string): boolean {
    if (this.activeRecordings.has(recordingId)) {
      this.stopRecording(recordingId);
    }
    return this.recordings.delete(recordingId);
  }

  /**
   * Generate file path for recording
   */
  private generateFilePath(title: string, format: string): string {
    const sanitized = title.replace(/[/\\?%*:|"<>]/g, "_");
    const timestamp = Date.now();
    return `recordings/${sanitized}_${timestamp}.${format.toLowerCase()}`;
  }

  /**
   * Get recording size estimate
   */
  getRecordingSizeEstimate(
    duration: number,
    quality: "SD" | "HD" | "4K",
  ): number {
    // Rough estimates in MB per minute
    const bitrates: Record<string, number> = {
      SD: 1.5, // ~1.5 MB/min for SD
      HD: 4, // ~4 MB/min for HD
      "4K": 12, // ~12 MB/min for 4K
    };

    return Math.round(duration * (bitrates[quality] || 4));
  }
}

export default new RecordingService();
