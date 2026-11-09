export interface CastDevice {
  id: string;
  name: string;
  type: "chromecast" | "airplay" | "roku" | "custom";
  ip: string;
  port: number;
  status: "available" | "connected" | "unavailable";
  capabilities: string[];
}

export interface CastSession {
  id: string;
  device: CastDevice;
  streamUrl: string;
  title: string;
  startTime: Date;
  currentTime: number;
  isPlaying: boolean;
}

export class CastingService {
  private devices: Map<string, CastDevice> = new Map();
  private activeSessions: Map<string, CastSession> = new Map();
  private discoveredDevices: CastDevice[] = [];

  /**
   * Discover available cast devices
   */
  async discoverDevices(): Promise<CastDevice[]> {
    // Simulate device discovery
    this.discoveredDevices = [
      {
        id: "device-1",
        name: "Living Room TV",
        type: "chromecast",
        ip: "192.168.1.100",
        port: 8008,
        status: "available",
        capabilities: ["video", "audio", "subtitle", "4k"],
      },
      {
        id: "device-2",
        name: "Bedroom Speaker",
        type: "chromecast",
        ip: "192.168.1.101",
        port: 8008,
        status: "available",
        capabilities: ["audio"],
      },
      {
        id: "device-3",
        name: "iPad",
        type: "airplay",
        ip: "192.168.1.102",
        port: 3689,
        status: "available",
        capabilities: ["video", "audio", "subtitle"],
      },
    ];

    return this.discoveredDevices;
  }

  /**
   * Register cast device
   */
  registerDevice(device: CastDevice): void {
    this.devices.set(device.id, device);
  }

  /**
   * Get available cast devices
   */
  getAvailableDevices(): CastDevice[] {
    return Array.from(this.devices.values()).filter(
      (d) => d.status !== "unavailable",
    );
  }

  /**
   * Get device by ID
   */
  getDevice(deviceId: string): CastDevice | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * Cast stream to device
   */
  async castToDevice(
    deviceId: string,
    streamUrl: string,
    title: string,
  ): Promise<CastSession | null> {
    const device = this.devices.get(deviceId);
    if (!device) {
      return null;
    }

    device.status = "connected";

    const session: CastSession = {
      id: `cast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      device,
      streamUrl,
      title,
      startTime: new Date(),
      currentTime: 0,
      isPlaying: true,
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  /**
   * Get active cast session
   */
  getActiveSession(deviceId: string): CastSession | null {
    for (const session of this.activeSessions.values()) {
      if (session.device.id === deviceId) {
        return session;
      }
    }
    return null;
  }

  /**
   * Stop casting
   */
  async stopCasting(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.device.status = "available";
    this.activeSessions.delete(sessionId);
    return true;
  }

  /**
   * Control cast session playback
   */
  controlPlayback(
    sessionId: string,
    command: "play" | "pause" | "stop" | "seek",
    parameter?: number,
  ): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    switch (command) {
      case "play":
        session.isPlaying = true;
        break;
      case "pause":
        session.isPlaying = false;
        break;
      case "stop":
        this.stopCasting(sessionId);
        break;
      case "seek":
        if (parameter !== undefined) {
          session.currentTime = parameter;
        }
        break;
    }

    return true;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): CastSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Check device capabilities
   */
  hasCapability(deviceId: string, capability: string): boolean {
    const device = this.devices.get(deviceId);
    return device?.capabilities.includes(capability) || false;
  }

  /**
   * Update device status
   */
  updateDeviceStatus(deviceId: string, status: CastDevice["status"]): void {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = status;
    }
  }
}

export default new CastingService();
