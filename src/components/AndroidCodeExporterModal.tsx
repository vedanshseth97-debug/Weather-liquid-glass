import React, { useState } from 'react';
import { X, Copy, Check, Code, Smartphone, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const ANDROID_COMPOSE_KOTLIN_CODE = `package com.example.liquidweather

import android.graphics.RenderEffect
import android.graphics.Shader
import android.os.Build
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.sin

// ==========================================
// 1. LIQUID GLASS MODIFIER (Apple Glassmorphism)
// ==========================================
fun Modifier.liquidGlass(
    cornerRadius: Dp = 28.dp,
    alpha: Float = 0.18f,
    tintColor: Color = Color.White,
    borderWidth: Dp = 1.2.dp
): Modifier = this
    .clip(RoundedCornerShape(cornerRadius))
    .background(
        brush = Brush.linearGradient(
            colors = listOf(
                tintColor.copy(alpha = alpha + 0.1f),
                tintColor.copy(alpha = alpha * 0.4f),
                tintColor.copy(alpha = alpha * 0.1f)
            ),
            start = Offset(0f, 0f),
            end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
        )
    )
    .border(
        width = borderWidth,
        brush = Brush.linearGradient(
            colors = listOf(
                Color.White.copy(alpha = 0.75f),
                Color.White.copy(alpha = 0.20f),
                Color.Transparent,
                Color.Cyan.copy(alpha = 0.25f)
            ),
            start = Offset(0f, 0f),
            end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
        ),
        shape = RoundedCornerShape(cornerRadius)
    )
    .then(
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            Modifier.graphicsLayer {
                renderEffect = RenderEffect
                    .createBlurEffect(35f, 35f, Shader.TileMode.CLAMP)
                    .asComposeRenderEffect()
            }
        } else Modifier
    )

// ==========================================
// 2. PROCEDURAL 3D LIQUID GLASS EMBLEM
// ==========================================
@Composable
fun Glass3DWeatherEmblem(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "icon_anim")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -8f,
        targetValue = 8f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "float"
    )

    Canvas(modifier = modifier.size(140.dp)) {
        val center = Offset(size.width / 2f, size.height / 2f + floatOffset)
        val sunCenter = Offset(center.x + 22.dp.toPx(), center.y - 18.dp.toPx())
        val sunRadius = 38.dp.toPx()

        // 3D Glass Sun Corona
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(Color(0xFFFFD54F).copy(alpha = 0.8f), Color.Transparent),
                center = sunCenter,
                radius = sunRadius * 1.6f
            ),
            radius = sunRadius * 1.6f,
            center = sunCenter
        )

        // 3D Glass Sun Core
        drawCircle(
            brush = Brush.linearGradient(
                colors = listOf(Color(0xFFFFE082), Color(0xFFFF6D00)),
                start = Offset(sunCenter.x - sunRadius, sunCenter.y - sunRadius),
                end = Offset(sunCenter.x + sunRadius, sunCenter.y + sunRadius)
            ),
            radius = sunRadius,
            center = sunCenter
        )

        // Frosted 3D Glass Cloud
        val cloudBaseY = center.y + 16.dp.toPx()
        val path = Path().apply {
            moveTo(center.x - 45.dp.toPx(), cloudBaseY)
            cubicTo(
                center.x - 65.dp.toPx(), cloudBaseY - 10.dp.toPx(),
                center.x - 55.dp.toPx(), cloudBaseY - 35.dp.toPx(),
                center.x - 30.dp.toPx(), cloudBaseY - 32.dp.toPx()
            )
            cubicTo(
                center.x - 20.dp.toPx(), cloudBaseY - 55.dp.toPx(),
                center.x + 25.dp.toPx(), cloudBaseY - 55.dp.toPx(),
                center.x + 35.dp.toPx(), cloudBaseY - 32.dp.toPx()
            )
            cubicTo(
                center.x + 60.dp.toPx(), cloudBaseY - 32.dp.toPx(),
                center.x + 65.dp.toPx(), cloudBaseY - 10.dp.toPx(),
                center.x + 45.dp.toPx(), cloudBaseY
            )
            close()
        }

        drawPath(
            path = path,
            brush = Brush.linearGradient(
                colors = listOf(
                    Color.White.copy(alpha = 0.55f),
                    Color(0xFF81D4FA).copy(alpha = 0.25f),
                    Color.White.copy(alpha = 0.1f)
                ),
                start = Offset(center.x - 50.dp.toPx(), cloudBaseY - 50.dp.toPx()),
                end = Offset(center.x + 50.dp.toPx(), cloudBaseY)
            )
        )

        drawPath(
            path = path,
            brush = Brush.linearGradient(
                colors = listOf(Color.White.copy(alpha = 0.9f), Color.Transparent, Color(0xFF00E5FF).copy(alpha = 0.4f)),
                start = Offset(center.x - 40.dp.toPx(), cloudBaseY - 50.dp.toPx()),
                end = Offset(center.x + 40.dp.toPx(), cloudBaseY)
            ),
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.dp.toPx())
        )
    }
}
`;

export const AndroidCodeExporterModal: React.FC<Props> = ({ isOpen, onClose, isDark }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ANDROID_COMPOSE_KOTLIN_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl flex flex-col ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Android Jetpack Compose Source Code
              </h2>
              <p className="text-xs opacity-60">
                Native Android Kotlin implementation of 3D Apple Liquid Glass
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/40 font-mono text-xs text-cyan-200 no-scrollbar select-text">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">
            {ANDROID_COMPOSE_KOTLIN_CODE}
          </pre>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs opacity-60">Ready to drop into Android Studio Flamingo+</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Kotlin Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
