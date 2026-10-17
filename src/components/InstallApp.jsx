import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export default function InstallApp({ language }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const vi = language === 'vi';
  useEffect(() => {
    const ready = event => { event.preventDefault(); setPrompt(event); };
    const done = () => { setInstalled(true); setPrompt(null); setOpen(false); };
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', done); };
  }, []);
  async function install() {
    if (!prompt) { setOpen(true); return; }
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch { setOpen(true); }
    finally { setPrompt(null); }
  }
  if (installed) return null;
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <button ref={trigger} className="install-app-button" onClick={install}><Download size={18} aria-hidden="true" />{vi ? 'Thêm ROSIC vào màn hình chính' : 'Add ROSIC to your home screen'}</button>
    <Dialog.Portal><Dialog.Overlay className="social-qr-overlay" /><Dialog.Content className="install-app-dialog" aria-describedby="install-help" onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}>
      <img src="/icons/rosic-192.png" alt="ROSIC" width="80" height="80" />
      <Dialog.Title>{vi ? 'ROSIC luôn bên bạn' : 'Keep ROSIC close'}</Dialog.Title>
      <div id="install-help">
        <p>{vi ? 'Mở website bằng Safari trên iPhone hoặc Chrome trên Android để thêm biểu tượng ROSIC vào màn hình chính.' : 'Open this website in Safari on iPhone or Chrome on Android to add the ROSIC icon to your home screen.'}</p>
        <p><Share size={18} aria-hidden="true" /> <strong>iPhone / iPad:</strong> {vi ? 'Chia sẻ → Thêm vào Màn hình chính.' : 'Share → Add to Home Screen.'}</p>
        <p><PlusSquare size={18} aria-hidden="true" /> <strong>Android:</strong> {vi ? 'Menu ⋮ → Thêm vào màn hình chính → Cài đặt.' : 'Menu ⋮ → Add to Home screen → Install.'}</p>
        <p>{vi ? 'Nếu đang mở trong Zalo/Facebook, hãy chọn mở bằng trình duyệt trước.' : 'If using Zalo/Facebook, open the page in your browser first.'}</p>
      </div>
      <Dialog.Close className="social-qr-close" aria-label={vi ? 'Đóng hướng dẫn cài đặt' : 'Close installation guide'}><X size={20} /></Dialog.Close>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
