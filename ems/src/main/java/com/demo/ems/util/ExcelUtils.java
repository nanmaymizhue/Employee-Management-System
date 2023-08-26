

package com.demo.ems.util;

import com.demo.ems.entity.Education;
import com.demo.ems.entity.Employee;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class ExcelUtils {

    public static List<Employee> parseExcelFile(InputStream inputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        List<Employee> employees = new ArrayList<>();
        DataFormatter dataFormatter = new DataFormatter();

        Map<String, Employee> employeeMap = new HashMap<>();

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);

            String employeeId = dataFormatter.formatCellValue(row.getCell(1));
            Employee employee = employeeMap.getOrDefault(employeeId, new Employee());

            if (!employeeId.isEmpty()) {
                employee.setId(null);
                employee.setEmployeeId(employeeId);
                employee.setName(dataFormatter.formatCellValue(row.getCell(2)));
                employee.setPosition(dataFormatter.formatCellValue(row.getCell(3)));
                employee.setDepartment(dataFormatter.formatCellValue(row.getCell(4)));
                employee.setAddress(dataFormatter.formatCellValue(row.getCell(5)));
                employee.setNrc(dataFormatter.formatCellValue(row.getCell(6)));

                Cell dobCell = row.getCell(7);
                if (dobCell != null) {
                    if (dobCell.getCellType() == CellType.STRING) {
                        try {
                            String dobString = dobCell.getStringCellValue();
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy, MMM, dd");
                            LocalDate dob = LocalDate.parse(dobString, formatter);
                            employee.setDob(dob);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else if (dobCell.getCellType() == CellType.NUMERIC) {
                        Date dobDate = dobCell.getDateCellValue();
                        employee.setDob(dobDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                    }
                }

                employee.setGender(dataFormatter.formatCellValue(row.getCell(8)));
                employee.setFatherName(dataFormatter.formatCellValue(row.getCell(9)));
                employee.setLicense(dataFormatter.formatCellValue(row.getCell(10)));
                employee.setTaxNo(dataFormatter.formatCellValue(row.getCell(11)));
                employee.setImage(dataFormatter.formatCellValue(row.getCell(12)));

                employeeMap.put(employeeId, employee);
            }
        }

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);

            String employeeId = dataFormatter.formatCellValue(row.getCell(1));
            Employee employee = employeeMap.get(employeeId);

            String educationType = dataFormatter.formatCellValue(row.getCell(13));
            String educationName = dataFormatter.formatCellValue(row.getCell(14));

            if (employee != null && !educationType.isEmpty() && !educationName.isEmpty()) {
                Education education = new Education();
                education.setType(educationType);
                education.setName(educationName);
                education.setEmployee(employee);

                // Check if the employee already has the educations list initialized
                if (employee.getEducation() == null) {
                    employee.setEducation(new ArrayList<>());
                }

                employee.getEducation().add(education);
            }
        }

        employees.addAll(employeeMap.values());

        workbook.close();
        return employees;
    }
}

