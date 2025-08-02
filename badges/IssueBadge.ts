import tiers from '../config/tiers.json';
import { createClient, ready } from '../src/discord';

export async function issueBadge(tierKey: string, userId: string) {
  const tier = (tiers as any)[tierKey];
  if (!tier) throw new Error(`Unknown tier: ${tierKey}`);

  const client = createClient();
  await client.login(process.env.DISCORD_TOKEN);
  await ready(client);

  const guild = client.guilds.cache.first();
  if (!guild) throw new Error('No guild found');

  const member = await guild.members.fetch(userId);
  await member.roles.add(tier.roleId);

  const channel = guild.systemChannel || guild.channels.cache.first();
  if (channel?.isText()) {
    await channel.send(tier.shrineMessage);
  }

  await client.destroy();
}
