export const getDateStringVN = () => {
  const now = new Date();

  const vnDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

  const day = String(vnDate.getDate()).padStart(2, "0");
  const month = String(vnDate.getMonth() + 1).padStart(2, "0");
  const year = String(vnDate.getFullYear()).slice(-2);

  return `${day}${month}${year}`; // VD: 170426
};
