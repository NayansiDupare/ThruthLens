from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from models.response_models import FullAnalysisResponse
import io

def generate_pdf_report(analysis: FullAnalysisResponse) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    Story = []

    # Title
    Story.append(Paragraph("TruthLens Analysis Report", styles['Title']))
    Story.append(Spacer(1, 12))

    # Verdict
    verdict_text = f"Verdict: {analysis.verdict} ({analysis.confidence_score}%)"
    Story.append(Paragraph(verdict_text, styles['Heading2']))
    Story.append(Spacer(1, 12))

    # Explanation
    Story.append(Paragraph("AI Explanation", styles['Heading3']))
    Story.append(Paragraph(analysis.ai_explanation, styles['Normal']))
    Story.append(Spacer(1, 12))

    # Red Flags
    if analysis.red_flags:
        Story.append(Paragraph("Red Flags", styles['Heading3']))
        for flag in analysis.red_flags:
            Story.append(Paragraph(f"- {flag}", styles['Normal']))
        Story.append(Spacer(1, 12))

    # Details
    Story.append(Paragraph("Source Analysis", styles['Heading3']))
    Story.append(Paragraph(f"Domain: {analysis.source_credibility.domain}", styles['Normal']))
    Story.append(Paragraph(f"Verdict: {analysis.source_credibility.verdict}", styles['Normal']))
    Story.append(Spacer(1, 12))
    
    doc.build(Story)
    pdf = buffer.getvalue()
    buffer.close()
    
    return pdf
