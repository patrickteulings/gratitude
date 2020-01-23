const beastie = [
  `Good times gone and you missed them`,
  `What's gone wrong in your system?`,
  `Things they bounce, like a Spalding`,
  `What'd you think? Did you miss your calling?`,
  `It's so free, this kind of feeling`,
  `It's like life, it's so appealing`,
  `When you've got so much to say`,
  `It's called gratitude, and that's right`,

  `Good times gone, but you feed it`,
  `Hate's grown strong, you feel you need it`,
  `Just one thing, do you know you`,
  `What you think? That the world owes you?`,
  `What's gonna’ set you free`,
  `Look inside and you'll see`,
  `When you've got so much to say`,
  `It's called gratitude, and that's right`,
  `Gotta lighten up right now`,
  `Shine like the sun`,
  `It's fingerlicking good y'all`,
  `Professor, what's another word for pirate treasure?`];

export function getBeastie (): string {
  const lngth = beastie.length;
  return beastie[Math.floor(Math.random() * Math.floor(lngth))];
}
