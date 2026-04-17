import Counter from "@/database/Counter";
import { getDateStringVN } from "@/utils/date";

export const generateBillCode = async () => {
  const date = getDateStringVN(); // 170426
  const name = `bill_${date}`;

  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = counter.seq;

  const code = `HD${date}-${seq.toString().padStart(4, "0")}`;

  return code;
};
