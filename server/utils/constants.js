const roles={
  ADMIN:"ADMIN",
  EDITOR:"EDITOR",
  CUSTOMER:"CUSTOMER"
}

const accountStatus={
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  FROZEN: "FROZEN",
  DELETED: "DELETED"
}
const transactionType={
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  TRANSFER: "TRANSFER"
}
const transactionStatus={
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
}
const gateway ={
  PAYSTACK: "PAYSTACK",
  FLUTTERWAVE: "FLUTTERWAVE",
  NONE: "NONE"
}
module.exports={gateway,roles,accountStatus,transactionType,transactionStatus}