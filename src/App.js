// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function App() {
  // replace with your node address
  const [node, setNode] = useState('https://edge1.bentleylab.net');
  const [conference, setConference] = useState('');
  const [state, setState] = useState('Disconnected');
  const localRef  = useRef(null);
  const remoteRef = useRef(null);
  let pexRTC;

  // load the client library on node change
  useEffect(() => {
    const existing = document.getElementById('pexrtc-script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'pexrtc-script';
    script.src = `${node}/static/webrtc/js/pexrtc.js`;
    script.onload = () => {
      pexRTC = new window.PexRTC({ node });
    };
    document.body.appendChild(script);
  }, [node]);

  const join = () => {
    setState('Connecting');
    pexRTC.join({ conference, audio: true, video: true })
      .onSetup(() => setState('Loading'))
      .onConnect(() => {
        setState('Connected');
        localRef.current.srcObject  = pexRTC.localStream;
        remoteRef.current.srcObject = pexRTC.remoteStream;
      })
      .onDisconnect(() => setState('Disconnected'))
      .onError(err => setState('Error: ' + err.message));
  };

  return (
    <div className="min-h-screen bg-app flex flex-col items-center p-8">
      <header className="w-full flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-main">Sexy Video</h1>
      </header>

      <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-xl">
        <label className="block mb-2 text-main">Node URL</label>
        <input
          type="text"
          value={node}
          onChange={e => setNode(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-xl border border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block mb-2 text-main">Conference Name</label>
        <input
          type="text"
          value={conference}
          onChange={e => setConference(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-xl border border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={join}
          className="w-full py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-dark transition"
        >
          🔥 Join
        </button>
      </div>

      <div className="mt-8 w-full flex justify-center space-x-4">
        <video ref={localRef} autoPlay muted className="w-1/3 rounded-xl bg-black" />
        <video ref={remoteRef} autoPlay className="w-2/3 rounded-xl bg-black" />
      </div>

      <p className="mt-4 text-main">Status: {state}</p>
    </div>
  );
}

export default App;
