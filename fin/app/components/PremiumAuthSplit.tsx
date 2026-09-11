"use client";

import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*  WebGL torus shader background                                             */
/* -------------------------------------------------------------------------- */

function TorusShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const VERT = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `;

    const FRAG = `
      precision highp float;
      uniform float uTime;
      uniform vec2  uResolution;

      mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

      float sdTorus(vec3 p, vec2 t) {
        vec2 q = vec2(length(p.xz) - t.x, p.y);
        return length(q) - t.y;
      }

      float map(vec3 p) {
        float t = uTime * 0.35;

        vec3 p1 = p;
        p1.xz *= rot(t * 0.70);
        p1.xy *= rot(t * 0.50);
        float d1 = sdTorus(p1, vec2(1.05, 0.32));

        vec3 p2 = p;
        p2.yz *= rot(t * 0.55 + 1.5);
        p2.xy *= rot(t * 0.40);
        float d2 = sdTorus(p2, vec2(0.90, 0.27));

        vec3 p3 = p;
        p3.xz *= rot(t * 0.45 + 3.0);
        p3.yz *= rot(t * 0.70);
        float d3 = sdTorus(p3, vec2(0.75, 0.22));

        return min(min(d1, d2), d3);
      }

      vec3 calcNormal(vec3 p) {
        vec2 e = vec2(0.0015, 0.0);
        return normalize(vec3(
          map(p + e.xyy) - map(p - e.xyy),
          map(p + e.yxy) - map(p - e.yxy),
          map(p + e.yyx) - map(p - e.yyx)
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution)
                  / min(uResolution.x, uResolution.y);

        vec3 ro = vec3(0.0, 0.0, 3.2);
        vec3 rd = normalize(vec3(uv * 0.85, -1.6));

        float t = 0.0;
        float d;
        bool hit = false;
        for (int i = 0; i < 72; i++) {
          vec3 p = ro + rd * t;
          d = map(p);
          if (d < 0.0015) { hit = true; break; }
          if (t > 8.0) break;
          t += d * 0.85;
        }

        vec3 col = vec3(0.015, 0.015, 0.025);

        if (hit) {
          vec3 p = ro + rd * t;
          vec3 n = calcNormal(p);
          vec3 lightDir = normalize(vec3(0.8, 1.0, 0.6));
          float diff = max(dot(n, lightDir), 0.0);
          float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.5);

          vec3 baseColor = mix(
            vec3(0.04, 0.06, 0.14),
            vec3(0.18, 0.40, 0.75),
            n.y * 0.5 + 0.5
          );

          col  = baseColor * (0.12 + diff * 0.45);
          col += vec3(0.30, 0.55, 1.00) * fres * 0.55;
          col += vec3(0.15, 0.35, 0.70)
                 * pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 32.0) * 0.6;
        }

        col *= 1.0 - length(uv) * 0.28;
        col  = pow(max(col, 0.0), vec3(0.4545));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uResolution");

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const render = () => {
      resize();
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* -------------------------------------------------------------------------- */
/*  Google brand mark                                                         */
/* -------------------------------------------------------------------------- */

function GoogleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C40.9 36.1 44 30.6 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  The block                                                                 */
/* -------------------------------------------------------------------------- */

export default function PremiumAuthSplit() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2 dark:bg-neutral-950">
      {/* Left: WebGL shader panel (hidden on mobile) */}
      <div className="relative hidden overflow-hidden bg-neutral-950 lg:block">
        <TorusShader />
      </div>

      {/* Right: sign-in form */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm shadow-black/10 ring-1 ring-black/10 transition duration-150 hover:bg-neutral-50 active:scale-[0.98] dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/40 dark:ring-white/10 dark:hover:bg-neutral-800"
          >
            <GoogleMark />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              or
            </span>
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="block w-full cursor-pointer rounded-lg bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm shadow-black/10 ring-1 ring-black/10 transition duration-150 placeholder:text-neutral-400 focus:cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.99] dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/40 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-blue-400"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="cursor-pointer text-xs font-medium text-blue-600 transition duration-150 hover:text-blue-500 active:scale-[0.98] dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="block w-full cursor-pointer rounded-lg bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm shadow-black/10 ring-1 ring-black/10 transition duration-150 placeholder:text-neutral-400 focus:cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.99] dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/40 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-blue-400"
              />
            </div>

            {/* Continue button with diffused glow */}
            <button
              type="submit"
              className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition duration-150 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] dark:shadow-blue-500/20 dark:focus:ring-offset-neutral-950"
            >
              Continue
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="cursor-pointer font-medium text-blue-600 transition duration-150 hover:text-blue-500 active:scale-[0.98] dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}