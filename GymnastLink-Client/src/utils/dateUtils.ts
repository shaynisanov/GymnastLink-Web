const parseExpirationInDays = (expiration: string) => {
  const match = expiration.match(/(\d+)([smhd])/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'm':
      return value / 1440; // minutes to days
    case 'h':
      return value / 24; // hours to days
    case 'd':
      return value; // days
    default:
      return 0;
  }
};

export {parseExpirationInDays};
