export const SHOW_DELETED_OPTIONS = {
    ALL: "true",
    ONLY_DELETED: "onlyDeleted"
} as const;

export const POST_STATUS = {
    PUBLISHED: "published",
    DRAFT: "draft"
} as const;

export const USER_ROLE = {
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
    MODERATOR: "MODERATOR",
} as const;
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
