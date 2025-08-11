function App() {
  const [image, setImage] = React.useState(null);
  const [result, setResult] = React.useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('propertyId', 'demo');
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h1>Landscape Analyzer</h1>
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
      {result && (
        <div>
          <h2>Tasks</h2>
          <ul>
            {result.tasks.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
