export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX_ERROR =
  "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-";

export const CATEGORY_LIST = [
  { text: "Hand", query: "hand" },
  { text: "Pose", query: "pose" },
  { text: "Face", query: "face" },
  { text: "Toe", query: "toe" },
  { text: "Animal", query: "animal" },
];

export const PAGE_SIZE = 10;
export const PAGE_DEFAULT = 1;
export const TOTAL_PAGE = 50;

export const timeOptions = [
  { value: 60, label: "1 Min" },
  { value: 180, label: "3 Min" },
  { value: 300, label: "5 Min" },
  { value: 600, label: "10 Min" },
  { value: 900, label: "15 Min" },
  { value: "null", label: "Unlimited" },
];
