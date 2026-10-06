import React, { useState } from 'react';
import { Database } from 'lucide-react';

export default function CsvToSql({ showToast }) {
  const [csvSqlInput, setCsvSqlInput] = useState('id,name,role\n1,Alex,Admin\n2,Sam,User');
  const [csvSqlTable, setCsvSqlTable] = useState('users');
  const [csvSqlOutput, setCsvSqlOutput] = useState('');

  const convertCsvToSql = async () => {
    if (!csvSqlInput.trim()) return;
    try {
      const Papa = (await import('papaparse')).default;
      Papa.parse(csvSqlInput.trim(), {
        header: true, skipEmptyLines: true,
        complete: (results) => {
          const sqls = results.data.map(row => {
            const vals = Object.values(row).map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
            return `INSERT INTO ${csvSqlTable} (${Object.keys(row).join(', ')}) VALUES (${vals});`;
          });
          setCsvSqlOutput(sqls.join('\n'));
          showToast('SQL Generated');
        }
      });
    } catch {
      showToast('Conversion failed', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>CSV Data</label>
        <textarea rows="6" className="form-control" value={csvSqlInput} onChange={(e) => setCsvSqlInput(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Table Name</label>
        <input type="text" className="form-control" value={csvSqlTable} onChange={(e) => setCsvSqlTable(e.target.value)} />
      </div>
      <button onClick={convertCsvToSql} className="btn btn-primary">
        <Database size={20} /> Generate SQL
      </button>
      {csvSqlOutput && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>SQL Queries</label>
          <textarea rows="8" readOnly className="form-control" value={csvSqlOutput} />
        </div>
      )}
    </div>
  );
}