import { Collection } from "discord.js";
const cooldowns: Collection<
  string,
  Collection<string, number>
> = new Collection();

export const setCooldown = async (
  command: string,
  user: string,
  amount: number
): Promise<void> => {
  if (!cooldowns.has(command)) {
    cooldowns.set(command, new Collection());
  }

  const timestamps = cooldowns.get(command)!;
  const now = Date.now();
  timestamps.set(user, now + amount);
  setTimeout(() => timestamps.delete(user), amount);
};

export const checkCooldown = async (
    command: string,
    user: string
  ): Promise<number> => {
    const timestamps = cooldowns.get(command);
    if (!timestamps || !timestamps.has(user)) {
      return 0;
    }
    const expirationTime = timestamps.get(user)!;
    return expirationTime - Date.now();
  };
