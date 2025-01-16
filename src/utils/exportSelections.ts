import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { GuestSelection } from '@/types/supabase/guest-selection';
import type { TalentProfile } from '@/types/talent';
import type { ExportOptions } from '@/types/export';

export async function exportSelections(
  selections: Record<string, GuestSelection>,
  talents: TalentProfile[],
  options: ExportOptions
) {
  const exportData = Object.entries(selections)
    .map(([talentId, selection]) => {
      const talent = talents.find(t => t.id === talentId);
      return {
        'Preference Order': selection.preference_order,
        'Talent Name': talent?.users?.full_name || '',
        'Country': talent?.country || '',
        'Native Language': talent?.native_language || '',
        'Comments': selection.comments || '',
        'Favorite': selection.liked ? 'Yes' : 'No',
        ...(options.includeDetails ? {
          'Category': talent?.talent_category || '',
          'Selected Date': new Date(selection.created_at).toLocaleDateString(),
          'Last Updated': new Date(selection.updated_at).toLocaleDateString()
        } : {})
      };
    })
    .sort((a, b) => (a['Preference Order'] || 0) - (b['Preference Order'] || 0));

  if (options.format === 'csv') {
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `talent-selections-${new Date().toISOString()}.csv`);
  } else {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selections');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `talent-selections-${new Date().toISOString()}.xlsx`);
  }
}