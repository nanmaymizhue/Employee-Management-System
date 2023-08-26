import { Education } from "./education";

export interface Employee {
    id:number;
    employeeId:string;
    name:string;
    position:string;
    department:string;
    address:string;
    nrc:string;
    dob:Date;
    gender:string;
    fatherName:string;
    license:string;
    taxNo:string;
    image:string;
    education:Education[];
}
