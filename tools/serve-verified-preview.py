"""Read-only localhost preview of the checked-in /radeq/ Pages artifact."""
import argparse
import http.server
from pathlib import Path
import subprocess
import urllib.parse

ROOT = Path(__file__).resolve().parents[1]
SITE = (ROOT / 'site').resolve()
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=4394)
args = parser.parse_args()
subprocess.run(['node', str(ROOT / 'tools/verify-publication.mjs'), '--site-only'], check=True)

class Preview(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, request_path):
        url_path = urllib.parse.unquote(urllib.parse.urlsplit(request_path).path)
        if not url_path.startswith('/radeq/'):
            return str(SITE / '__not_found__')
        candidate = (SITE / url_path[len('/radeq/'):]).resolve()
        if candidate != SITE and SITE not in candidate.parents:
            return str(SITE / '__not_found__')
        return str(candidate)

    def do_GET(self):
        if urllib.parse.urlsplit(self.path).path in ('/', '/radeq'):
            self.send_response(302)
            self.send_header('Location', '/radeq/')
            self.end_headers()
            return
        return super().do_GET()

    def do_POST(self):
        self.send_error(405, 'Static preview has no API')

class PreviewServer(http.server.ThreadingHTTPServer):
    # Windows must reject an already occupied port instead of sharing a listener.
    allow_reuse_address = False

server = PreviewServer(('127.0.0.1', args.port), Preview)
print(f'CZ http://127.0.0.1:{args.port}/radeq/ | EN http://127.0.0.1:{args.port}/radeq/en/', flush=True)
server.serve_forever()
