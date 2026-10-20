// Тестовые данные. Записи получают уникальный суффикс, чтобы тесты не зависели
// от содержимого базы и не мешали друг другу.

export const credentials = {
  username: "admin",
  password: "secret",
};

// Записи, с которыми приложение стартует.
export const seedUsers = [
  { email: "john@google.com", firstName: "John", lastName: "Doe" },
  { email: "jack@yahoo.com", firstName: "Jack", lastName: "Jons" },
];

export const seedStatuses = [
  { name: "Draft", slug: "draft" },
  { name: "To Review", slug: "to_review" },
  { name: "To Be Fixed", slug: "to_be_fixed" },
  { name: "To Publish", slug: "to_publish" },
  { name: "Published", slug: "published" },
];

export const seedLabels = [{ name: "bug" }, { name: "enhancement" }];

export const messages = {
  required: "Required",
  invalidEmail: "Incorrect email format",
};

export const invalidEmail = "not-an-email";

const generateId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const buildUser = () => {
  const id = generateId();
  return {
    email: `user-${id}@example.com`,
    firstName: `Firstname${id}`,
    lastName: `Lastname${id}`,
  };
};

export const buildStatus = () => {
  const id = generateId();
  return {
    name: `Status ${id}`,
    slug: `status_${id}`,
  };
};

export const buildLabel = () => {
  const id = generateId();
  return {
    name: `label-${id}`,
  };
};

export const buildTask = (attributes) => {
  const id = generateId();
  return {
    title: `Task ${id}`,
    content: `Content of task ${id}`,
    labels: [],
    ...attributes,
  };
};
