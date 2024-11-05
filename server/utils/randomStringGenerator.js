const randomStringGenerator = () => {
  const randomString = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join(""); // 배열을 문자열로 변환

  return randomString;
};

module.exports = randomStringGenerator;
