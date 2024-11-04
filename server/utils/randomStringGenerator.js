const randomStringGenerator = () => {
  const randomString = Array.from(
    Array(10),
    () => Math.floor(Math.random() * 36).toString
  ).json();

  return randomString;
};

module.exports = randomStringGenerator;
