import type { DemoPreviewId } from '../data/demoPreviews';
import AiAssistantPreview from './demo-previews/AiAssistantPreview';
import DataProcessingPreview from './demo-previews/DataProcessingPreview';
import DocumentConversionPreview from './demo-previews/DocumentConversionPreview';
import MaintenancePreview from './demo-previews/MaintenancePreview';
import SeoAuditPreview from './demo-previews/SeoAuditPreview';
import WorkflowPrototypePreview from './demo-previews/WorkflowPrototypePreview';

interface Props {
  id: DemoPreviewId;
}

export default function DemoPreviewRegistry({ id }: Props) {
  switch (id) {
    case 'seo-audit':
      return <SeoAuditPreview />;
    case 'workflow-prototype':
      return <WorkflowPrototypePreview />;
    case 'maintenance':
      return <MaintenancePreview />;
    case 'ai-assistant':
      return <AiAssistantPreview />;
    case 'data-processing':
      return <DataProcessingPreview />;
    case 'document-conversion':
      return <DocumentConversionPreview />;
  }
}
