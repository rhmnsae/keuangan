import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const money = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID')
const today = () => new Date().toISOString().slice(0, 10)
const nav = ['Landing', 'Login', 'Dashboard', 'Chatbot', 'Split Bill', 'Laporan', 'Budget', 'Admin']
const seedTx = [
  { id: 1, date: today(), type: 'in', cat: 'Income', note: 'Freelance landing page', amount: 750000 },
  { id: 2, date: today(), type: 'out', cat: 'Food', note: 'Kopi + nasi ayam', amount: 42000 },
]

function parseChat(text) {
  const s = text.toLowerCase()
  const type = /(keluar|jajan|beli|bayar|spent|expense)/.test(s) ? 'out' : 'in'
  const match = text.match(/(?:rp\s*)?([0-9][0-9.]*)/i)
  const amount = match ? Number(match[1].replace(/\./g, '')) : 0
  let cat = type === 'out' ? 'Lifestyle' : 'Income'
  if (/makan|kopi|food|ayam|nasi/.test(s)) cat = 'Food'
  if (/transport|grab|gojek|bensin/.test(s)) cat = 'Transport'
  if (/gaji|freelance|jualan|income|masuk/.test(s)) cat = 'Income'
  const note = text.replace(/(?:rp\s*)?[0-9][0-9.]*/gi, '').trim() || 'Catatan cepat'
  return { id: Date.now(), date: today(), type, cat, note, amount }
}

function Logo() {
  return <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center border-[3px] border-ink bg-lime shadow-brutalSm rotate-[-2deg]"><b>UM</b></div><b className="font-pixel text-2xl">UangMasuk</b></div>
}
function Button({ children, onClick, tone = 'lime', type = 'button' }) {
  const tones = { lime: 'bg-lime text-ink', cyan: 'bg-cyan text-ink', pink: 'bg-pink text-white', dark: 'bg-ink text-white', white: 'bg-white text-ink' }
  return <button type={type} onClick={onClick} className={`brutal-btn ${tones[tone]}`}>{children}</button>
}
function Kicker({ children }) { return <span className="inline-flex border-2 border-ink bg-cyan px-3 py-2 font-black shadow-brutalSm">{children}</span> }
function Card({ children, className = '' }) { return <div className={`brutal-card ${className}`}>{children}</div> }
function Stat({ label, value, color }) { return <div className={`min-w-[160px] flex-1 border-[3px] border-ink p-4 shadow-brutalSm ${color}`}><div className="text-xs font-black uppercase">{label}</div><div className="mt-2 font-pixel text-3xl font-black">{value}</div></div> }

function App() {
  const [page, setPage] = useState('Landing')
  const [tx, setTx] = useState(seedTx)
  const screens = {
    Landing: <Landing go={setPage} />,
    Login: <Login go={setPage} />,
    Dashboard: <Dashboard tx={tx} setTx={setTx} />,
    Chatbot: <Chatbot tx={tx} setTx={setTx} />,
    'Split Bill': <SplitBill />,
    Laporan: <Dashboard tx={tx} setTx={setTx} title="Laporan" />,
    Budget: <Budget />,
    Admin: <Admin />,
  }
  return <div className="min-h-screen bg-paper/70"><header className="sticky top-0 z-20 border-b-[3px] border-ink bg-paper/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3"><Logo /> <div className="ml-auto flex gap-2">{nav.map(n => <button key={n} onClick={() => setPage(n)} className={`chip whitespace-nowrap ${page === n ? '!bg-lime' : ''}`}>{n}</button>)}</div></div></header>{screens[page]}</div>
}

function Landing({ go }) {
  return <main className="mx-auto max-w-7xl px-4 py-12"><section className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]"><div><Kicker>8-BIT MONEY TRACKER</Kicker><h1 className="pixel-title mt-5 max-w-4xl text-6xl leading-[.88] md:text-8xl">Keuangan Gen Z yang gak bikin pusing.</h1><p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-muted">Catat pemasukan, jajan, split bill, budget, laporan, sampai chatbot input otomatis. Tinggal ketik: “beli kopi 18000”, datanya langsung masuk.</p><div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => go('Login')}>Mulai Gratis</Button><Button tone="cyan" onClick={() => go('Dashboard')}>Coba Dashboard</Button></div></div><Card className="rotate-1 bg-paper2"><div className="border-[3px] border-ink bg-ink p-5 font-pixel text-xl font-black text-white"><p><span className="text-lime">&gt;</span> jajan kopi 18.000</p><p><span className="text-lime">OK</span> expense: Food / Rp18.000</p><p><span className="text-cyan">&gt;</span> split bill 150.000: Sae,Dya,Raka</p><p><span className="text-pink">PAY</span> Rp50.000/orang</p></div></Card></section><section className="py-16"><div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end"><h2 className="pixel-title text-5xl">Fitur lengkap</h2><p className="font-bold text-muted">Dibuat untuk lifestyle, usaha kecil, dan anak muda.</p></div><div className="grid gap-5 md:grid-cols-3"><Feature title="Chatbot Input" text="Ketik natural, transaksi otomatis terbaca." /><Feature title="Split Bill" text="Bagi tagihan nongkrong cepat dan rapi." /><Feature title="Budget & Goals" text="Target tabungan, limit jajan, dan insight." /><Feature title="Dashboard" text="Saldo, pemasukan, pengeluaran, aktivitas." /><Feature title="Admin" text="Kelola user, plan, status server, audit." /><Feature title="PWA Ready" text="Siap dikembangkan jadi web app ringan." /></div></section></main>
}
function Feature({ title, text }) { return <Card><h3 className="font-pixel text-3xl font-black">{title}</h3><p className="mt-2 font-bold text-muted">{text}</p></Card> }

function Login({ go }) {
  const [tab, setTab] = useState('Login')
  return <main className="grid min-h-[calc(100vh-76px)] place-items-center px-4 py-10"><Card className="w-full max-w-xl shadow-brutalLg"><Logo /><h1 className="pixel-title mt-6 text-5xl">Akses Akun</h1><p className="mt-2 font-bold text-muted">Login, daftar, lupa password, dan OTP tetap ada dalam satu layar.</p><div className="mt-5 flex flex-wrap gap-2">{['Login', 'Register', 'Lupa Password', 'OTP'].map(x => <button key={x} onClick={() => setTab(x)} className={`chip ${tab === x ? '!bg-lime' : ''}`}>{x}</button>)}</div><form className="mt-5 grid gap-3" onSubmit={e => { e.preventDefault(); go('Dashboard') }}><input className="brutal-input" placeholder={tab === 'OTP' ? 'Kode OTP' : 'Email'} /><input className="brutal-input" placeholder={tab === 'Register' ? 'Nama kamu' : 'Password'} type={tab === 'Login' ? 'password' : 'text'} /><Button type="submit" tone={tab === 'Lupa Password' ? 'pink' : 'lime'}>{tab === 'Login' ? 'Masuk Demo' : tab === 'Register' ? 'Buat Akun' : tab === 'OTP' ? 'Verifikasi' : 'Kirim Link'}</Button></form></Card></main>
}

function Shell({ title, children }) {
  return <main className="mx-auto max-w-7xl px-4 py-8"><div className="mb-6"><Kicker>GENZ FINANCE OS</Kicker><h1 className="pixel-title mt-4 text-5xl md:text-6xl">{title}</h1></div>{children}</main>
}
function Dashboard({ tx, setTx, title = 'Dashboard' }) {
  const totals = useMemo(() => { const inc = tx.filter(x => x.type === 'in').reduce((a, b) => a + b.amount, 0); const out = tx.filter(x => x.type === 'out').reduce((a, b) => a + b.amount, 0); return { inc, out, bal: inc - out, count: tx.length } }, [tx])
  return <Shell title={title}><div className="grid gap-4 md:grid-cols-4"><Stat label="Pemasukan" value={money(totals.inc)} color="bg-lime" /><Stat label="Pengeluaran" value={money(totals.out)} color="bg-pink text-white" /><Stat label="Balance" value={money(totals.bal)} color="bg-cyan" /><Stat label="Transaksi" value={totals.count} color="bg-paper2" /></div><ChatPanel setTx={setTx} /><TxTable tx={tx} setTx={setTx} /></Shell>
}
function ChatPanel({ setTx }) {
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('Ketik transaksi natural untuk auto input.')
  function add(v = text) { const item = parseChat(v); setTx(t => [item, ...t]); setMsg(`OK! ${item.type === 'out' ? 'Pengeluaran' : 'Pemasukan'} ${money(item.amount)} kategori ${item.cat} sudah dicatat.`); setText('') }
  return <Card className="mt-6"><h2 className="font-pixel text-3xl font-black">Chatbot Cepat</h2><form className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={e => { e.preventDefault(); add() }}><input value={text} onChange={e => setText(e.target.value)} className="brutal-input" placeholder="contoh: jajan kopi 18000" /><Button type="submit">Input</Button></form><p className="mt-3 border-2 border-ink bg-paper2 p-3 font-bold">{msg}</p><div className="mt-3 flex flex-wrap gap-2">{['jajan kopi 18000', 'masuk freelance 750000', 'beli nasi ayam 25000'].map(s => <button key={s} onClick={() => add(s)} className="chip">{s}</button>)}</div></Card>
}
function TxTable({ tx, setTx }) { return <Card className="mt-6"><h2 className="mb-3 font-pixel text-3xl font-black">Transaksi Terbaru</h2><div className="overflow-auto border-[3px] border-ink"><table className="w-full min-w-[720px] border-collapse bg-white"><thead><tr className="bg-paper2 font-pixel text-xl"><th className="border-b-2 border-ink p-3 text-left">Tanggal</th><th className="border-b-2 border-ink p-3 text-left">Tipe</th><th className="border-b-2 border-ink p-3 text-left">Kategori</th><th className="border-b-2 border-ink p-3 text-left">Catatan</th><th className="border-b-2 border-ink p-3 text-left">Nominal</th><th className="border-b-2 border-ink p-3 text-left">Aksi</th></tr></thead><tbody>{tx.map(x => <tr key={x.id} className="font-bold"><td className="border-b-2 border-ink p-3">{x.date}</td><td className="border-b-2 border-ink p-3"><span className={`border-2 border-ink px-2 py-1 font-black ${x.type === 'out' ? 'bg-red text-white' : 'bg-green'}`}>{x.type === 'out' ? 'Keluar' : 'Masuk'}</span></td><td className="border-b-2 border-ink p-3">{x.cat}</td><td className="border-b-2 border-ink p-3">{x.note}</td><td className="border-b-2 border-ink p-3">{money(x.amount)}</td><td className="border-b-2 border-ink p-3"><button className="chip" onClick={() => setTx(t => t.filter(y => y.id !== x.id))}>hapus</button></td></tr>)}</tbody></table></div></Card> }
function Chatbot({ tx, setTx }) { const [amount, setAmount] = useState(''); const [note, setNote] = useState(''); return <Shell title="Chatbot & Transaksi"><Card><h2 className="font-pixel text-3xl font-black">Input Manual</h2><form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={e => { e.preventDefault(); setTx(t => [{ id: Date.now(), date: today(), type: 'out', cat: 'Manual', note: note || 'Manual', amount: Number(amount) || 0 }, ...t]); setAmount(''); setNote('') }}><input className="brutal-input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Nominal" /><input className="brutal-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan" /><Button type="submit">Simpan</Button></form></Card><ChatPanel setTx={setTx} /><TxTable tx={tx} setTx={setTx} /></Shell> }
function SplitBill() { const [total, setTotal] = useState(''); const [names, setNames] = useState('Sae, Dya, Raka'); const people = names.split(',').map(x => x.trim()).filter(Boolean); const each = people.length ? Math.ceil((Number(total) || 0) / people.length) : 0; return <Shell title="Split Bill"><Card><h2 className="font-pixel text-3xl font-black">Split Bill</h2><div className="mt-3 grid gap-3 md:grid-cols-2"><input className="brutal-input" value={total} onChange={e => setTotal(e.target.value)} placeholder="Total tagihan" /><input className="brutal-input" value={names} onChange={e => setNames(e.target.value)} placeholder="Nama, pisahkan koma" /></div><div className="mt-4 grid gap-3 md:grid-cols-3">{people.map(p => <div key={p} className="border-2 border-ink bg-paper2 p-3 font-black shadow-brutalSm">{p}: {money(each)}</div>)}</div></Card></Shell> }
function Budget() { return <Shell title="Budget & Goals"><div className="grid gap-5 md:grid-cols-2"><Card><h2 className="font-pixel text-3xl font-black">Dana Darurat</h2><p className="mt-2 font-bold">Rp 850.000 / Rp 3.000.000</p><div className="mt-3 h-5 border-2 border-ink bg-white"><div className="h-full w-[28%] bg-lime" /></div><b>28%</b></Card><Card><h2 className="font-pixel text-3xl font-black">Catatan Gen Z</h2><textarea className="brutal-input mt-3 min-h-32" placeholder="Tulis rencana uang kamu..." /></Card></div></Shell> }
function Admin() { return <Shell title="Admin"><div className="grid gap-4 md:grid-cols-4"><Stat label="Users" value="128" color="bg-lime" /><Stat label="Plan Pro" value="24" color="bg-cyan" /><Stat label="Server" value="OK" color="bg-paper2" /><Stat label="Alerts" value="0" color="bg-pink text-white" /></div><Card className="mt-6"><h2 className="font-pixel text-3xl font-black">Admin Control</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="border-2 border-ink bg-paper2 p-4 font-black shadow-brutalSm">Kelola Akun</div><div className="border-2 border-ink bg-paper2 p-4 font-black shadow-brutalSm">Status Server</div><div className="border-2 border-ink bg-paper2 p-4 font-black shadow-brutalSm">Audit Log</div></div></Card></Shell> }

createRoot(document.getElementById('root')).render(<App />)
