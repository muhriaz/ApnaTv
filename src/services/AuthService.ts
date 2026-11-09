export interface ParentalControlSettings {
  enabled: boolean;
  pin: string;
  restrictedAges: string[];
  lockedCategories: string[];
  contentRating: "U" | "PG" | "12A" | "15" | "18" | "unrated";
  purchaseRestriction: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  pin?: string;
  age?: number;
  avatar?: string;
  playlists: string[];
  favorites: string[];
  watchHistory: string[];
  settings: Record<string, any>;
  createdAt: Date;
  lastAccessed: Date;
}

export class AuthService {
  private profiles: Map<string, UserProfile> = new Map();
  private parentalControls: Map<string, ParentalControlSettings> = new Map();
  private currentProfile: UserProfile | null = null;
  private pinAttempts: number = 0;
  private maxPinAttempts: number = 3;
  private lockoutTime: number = 0;

  /**
   * Create user profile
   */
  createProfile(name: string, age?: number, pin?: string): UserProfile {
    const profile: UserProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      pin: pin ? this.hashPin(pin) : undefined,
      age,
      playlists: [],
      favorites: [],
      watchHistory: [],
      settings: {},
      createdAt: new Date(),
      lastAccessed: new Date(),
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Get profile by ID
   */
  getProfile(profileId: string): UserProfile | null {
    return this.profiles.get(profileId) || null;
  }

  /**
   * Get all profiles
   */
  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Update profile
   */
  updateProfile(
    profileId: string,
    updates: Partial<UserProfile>,
  ): UserProfile | null {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      return null;
    }

    Object.assign(profile, updates);
    profile.lastAccessed = new Date();
    return profile;
  }

  /**
   * Delete profile
   */
  deleteProfile(profileId: string): boolean {
    return this.profiles.delete(profileId);
  }

  /**
   * Switch to profile
   */
  switchToProfile(profileId: string, pin?: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      return false;
    }

    // Check PIN if profile has one
    if (profile.pin) {
      if (!pin || !this.verifyPin(pin, profile.pin)) {
        this.handlePinFailure();
        return false;
      }
    }

    this.currentProfile = profile;
    profile.lastAccessed = new Date();
    this.pinAttempts = 0;
    return true;
  }

  /**
   * Get current profile
   */
  getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }

  /**
   * Set profile PIN
   */
  setProfilePin(profileId: string, pin: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      return false;
    }

    profile.pin = this.hashPin(pin);
    return true;
  }

  /**
   * Verify profile PIN
   */
  verifyProfilePin(profileId: string, pin: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile || !profile.pin) {
      return false;
    }

    return this.verifyPin(pin, profile.pin);
  }

  /**
   * Setup parental controls
   */
  setupParentalControls(
    profileId: string,
    settings: ParentalControlSettings,
  ): void {
    this.parentalControls.set(profileId, {
      ...settings,
      pin: this.hashPin(settings.pin),
    });
  }

  /**
   * Get parental control settings
   */
  getParentalControls(profileId: string): ParentalControlSettings | null {
    return this.parentalControls.get(profileId) || null;
  }

  /**
   * Check if content is allowed by parental controls
   */
  isContentAllowed(
    profileId: string,
    contentAge: number,
    contentCategory?: string,
  ): boolean {
    const controls = this.parentalControls.get(profileId);
    if (!controls || !controls.enabled) {
      return true;
    }

    // Check age restriction
    if (contentAge && contentAge > 0) {
      const profile = this.profiles.get(profileId);
      if (profile && profile.age && profile.age + 18 < contentAge) {
        return false;
      }
    }

    // Check category restriction
    if (
      contentCategory &&
      controls.lockedCategories.includes(contentCategory)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Lock category
   */
  lockCategory(profileId: string, category: string): void {
    const controls = this.parentalControls.get(profileId);
    if (controls && !controls.lockedCategories.includes(category)) {
      controls.lockedCategories.push(category);
    }
  }

  /**
   * Unlock category
   */
  unlockCategory(profileId: string, category: string, pin: string): boolean {
    const controls = this.parentalControls.get(profileId);
    if (!controls) {
      return false;
    }

    if (!this.verifyPin(pin, controls.pin)) {
      return false;
    }

    const index = controls.lockedCategories.indexOf(category);
    if (index > -1) {
      controls.lockedCategories.splice(index, 1);
    }

    return true;
  }

  /**
   * Get locked categories
   */
  getLockedCategories(profileId: string): string[] {
    const controls = this.parentalControls.get(profileId);
    return controls ? [...controls.lockedCategories] : [];
  }

  /**
   * Add to watch history
   */
  addToWatchHistory(profileId: string, contentId: string): void {
    const profile = this.profiles.get(profileId);
    if (profile) {
      profile.watchHistory.unshift(contentId);
      // Keep only last 100 items
      if (profile.watchHistory.length > 100) {
        profile.watchHistory.pop();
      }
    }
  }

  /**
   * Add to favorites
   */
  addToFavorites(profileId: string, contentId: string): void {
    const profile = this.profiles.get(profileId);
    if (profile && !profile.favorites.includes(contentId)) {
      profile.favorites.push(contentId);
    }
  }

  /**
   * Remove from favorites
   */
  removeFromFavorites(profileId: string, contentId: string): void {
    const profile = this.profiles.get(profileId);
    if (profile) {
      const index = profile.favorites.indexOf(contentId);
      if (index > -1) {
        profile.favorites.splice(index, 1);
      }
    }
  }

  /**
   * Get watch history
   */
  getWatchHistory(profileId: string): string[] {
    const profile = this.profiles.get(profileId);
    return profile ? [...profile.watchHistory] : [];
  }

  /**
   * Get favorites
   */
  getFavorites(profileId: string): string[] {
    const profile = this.profiles.get(profileId);
    return profile ? [...profile.favorites] : [];
  }

  /**
   * Hash PIN
   */
  private hashPin(pin: string): string {
    // In production, use proper bcrypt or similar
    return Buffer.from(pin).toString("base64");
  }

  /**
   * Verify PIN
   */
  private verifyPin(pin: string, hashedPin: string): boolean {
    return this.hashPin(pin) === hashedPin;
  }

  /**
   * Handle PIN failure
   */
  private handlePinFailure(): void {
    this.pinAttempts++;
    if (this.pinAttempts >= this.maxPinAttempts) {
      this.lockoutTime = Date.now() + 30000; // 30 second lockout
    }
  }

  /**
   * Check if locked out
   */
  isLockedOut(): boolean {
    if (this.lockoutTime > Date.now()) {
      return true;
    }
    this.lockoutTime = 0;
    return false;
  }

  /**
   * Get remaining lockout time in seconds
   */
  getRemainingLockoutTime(): number {
    if (this.isLockedOut()) {
      return Math.ceil((this.lockoutTime - Date.now()) / 1000);
    }
    return 0;
  }
}

export default new AuthService();
