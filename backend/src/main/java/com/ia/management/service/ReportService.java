package com.ia.management.service;

import com.ia.management.model.IAMark;
import com.ia.management.model.Student;
import com.ia.management.repository.IAMarkRepository;
import com.ia.management.repository.AttendanceRepository;
import com.ia.management.model.Attendance;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private IAMarkRepository markRepo;

    @Autowired
    private AttendanceRepository attendanceRepo;

    public byte[] generateDepartmentMarksPdf(String department) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Department IA Marks Report - " + department, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Fetch Marks
            List<IAMark> marks = markRepo.findBySubject_Department(department);

            // Group by Subject
            Map<String, List<IAMark>> marksBySubject = marks.stream()
                    .filter(m -> m.getSubject() != null)
                    .collect(Collectors.groupingBy(m -> m.getSubject().getName()));

            for (Map.Entry<String, List<IAMark>> entry : marksBySubject.entrySet()) {
                String subjectName = entry.getKey();
                List<IAMark> subjectMarks = entry.getValue();

                // Sort by RegNo
                subjectMarks.sort((m1, m2) -> {
                    String r1 = m1.getStudent() != null ? m1.getStudent().getRegNo() : "";
                    String r2 = m2.getStudent() != null ? m2.getStudent().getRegNo() : "";
                    return r1.compareTo(r2);
                });

                document.add(
                        new Paragraph("Subject: " + subjectName, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
                document.add(new Paragraph("\n"));

                PdfPTable table = new PdfPTable(5); // Sl, RegNo, Name, CIE1, Total
                table.setWidthPercentage(100);
                table.setWidths(new int[] { 1, 3, 4, 2, 2 });

                // Headers
                addHeader_cell(table, "Sl. No.");
                addHeader_cell(table, "Reg No");
                addHeader_cell(table, "Student Name");
                addHeader_cell(table, "CIE-1"); // Simplified for now
                addHeader_cell(table, "Total");

                int sl = 1;
                for (IAMark mark : subjectMarks) {
                    Student s = mark.getStudent();
                    table.addCell(String.valueOf(sl++));
                    table.addCell(s != null ? s.getRegNo() : "-");
                    table.addCell(s != null ? s.getName() : "-");
                    table.addCell(mark.getCo1Score() != null ? String.valueOf(mark.getCo1Score()) : "0");
                    table.addCell(mark.getTotalScore() != null ? String.valueOf(mark.getTotalScore()) : "0");
                }

                document.add(table);
                document.add(new Paragraph("\n"));
            }

            document.close();
            return out.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public byte[] generateSubjectAttendanceCsv(Long subjectId) {
        List<Attendance> attendanceList = attendanceRepo.findBySubjectId(subjectId);

        // Sort by Date then Student
        attendanceList.sort(Comparator.comparing(Attendance::getDate)
                .thenComparing(a -> a.getStudent().getRegNo()));

        StringBuilder csv = new StringBuilder();
        csv.append("Sl. No.,Date,Reg No,Student Name,Status\n");

        int sl = 1;
        for (Attendance a : attendanceList) {
            csv.append(sl++).append(",");
            csv.append(a.getDate()).append(",");
            csv.append(a.getStudent().getRegNo()).append(",");
            csv.append("\"").append(a.getStudent().getName()).append("\","); // Quote name for safety
            csv.append(a.getStatus()).append("\n");
        }

        return csv.toString().getBytes();
    }

    private void addHeader_cell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        table.addCell(cell);
    }
}
