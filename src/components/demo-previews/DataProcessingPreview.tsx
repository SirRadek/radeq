export default function DataProcessingPreview() {
  return (
    <div className="mini-site mini-site--data" data-demo-preview="data-processing">
      <header className="mini-site__header">
        <p>DATA_FILTER_V1</p>
        <h3>Intake rows checked, filtered, and converted into a decision view.</h3>
      </header>
      <table className="mini-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Status</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Form leads</td>
            <td>validated</td>
            <td>12 qualified</td>
          </tr>
          <tr>
            <td>Sheet import</td>
            <td>cleaned</td>
            <td>4 duplicates removed</td>
          </tr>
          <tr>
            <td>Priority view</td>
            <td>ready</td>
            <td>owner assigned</td>
          </tr>
        </tbody>
      </table>
      <ul className="mini-checks">
        <li>required.fields: OK</li>
        <li>duplicate.scan: OK</li>
      </ul>
    </div>
  );
}
