// ==UserScript==
// @name         Highlight Release Groups with DV/HDR Tags and Move Parent to Top (SPA Compatible)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Highlight h2s based on release group tiers and add type/DV/HDR/tier tags, working with SPA and mobile delays. Also removes line-clamp-2 class regularly.
// @match        *://debridmediamanager.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
  
    const releaseGroups = {
      remux: {
        tier1: ["3L", "BiZKiT", "BLURANiUM", "BMF", "CiNEPHiLES", "FraMeSToR", "PmP", "WiLDCAT", "ZQ"],
        tier2: ["Flights", "NCmt", "playBD", "SiCFoI", "SURFINBIRD", "TEPES"],
        tier3: ["ATELiER", "decibeL", "EPSiLON", "HiFi", "iFT", "KRaLiMaRK", "NTb", "PTP", "SumVision", "TOA", "TRiToN"]
      },
      "4kencode": {
        tier1: ["CtrlHD", "MainFrame", "DON", "W4NK3R"],
        tier2: ["HQMUX"],
        tier3: ["BHDStudio", "hallowed", "HONE", "PTer", "SPHD", "WEBDV"]
      },
      encode: {
        tier1: ["BBQ", "BMF", "c0kE", "Chotab", "CRiSC", "CtrlHD", "D-Z0N3", "Dariush", "decibeL", "DON", "EbP", "EDPH", "Geek", "LolHD", "NCmt", "PTer", "TayTO", "TDD", "TnP", "VietHD", "ZQ"],
        tier2: ["EA", "HiDt", "HiSD", "iFT", "NTb", "QOQ", "SA89", "sbR"],
        tier3: ["ATELiER", "BHDStudio", "hallowed", "HiFi", "HONE", "LoRD", "playHD", "SPHD", "W4NK3R"]
      },
      web: {
        tier1: ["ABBIE", "AJP69", "APEX", "PAXA", "PEXA", "XEPA", "BLUTONiUM", "CMRG", "CRFW", "CRUD", "FLUX", "GNOME", "HONE", "KiNGS", "Kitsune", "NOSiViD", "NTb", "NTG", "SiC", "TEPES"],
        tier2: ["dB", "Flights", "MiU", "monkee", "MZABI", "PHOENiX", "playWEB", "SbR", "SMURF", "TOMMY", "XEBEC", "4KBEC", "CEBEX"],
        tier3: ["BYNDR", "GNOMiSSiON", "NINJACENTRAL", "NPMS", "ROCCaT", "SiGMA", "SLiGNOME", "SwAgLaNdEr"]
      }
    };
  
    const tierColors = {
      tier1: 'gold',
      tier2: 'silver',
      tier3: 'peru'
    };
  
    function getMatchInfo(text) {
      const isRemux = /remux/i.test(text);
      const isWeb = /WEB[-_. ]?DL/i.test(text);
      const is4k = /2160p|4k/i.test(text);
  
      if (isWeb) {
        for (const [tier, names] of Object.entries(releaseGroups.web)) {
          for (const name of names) {
            const pattern = new RegExp(`[\\.-]${name}[\\.-]?`, 'i');
            if (pattern.test(text)) {
              return { type: 'web', tier, group: name };
            }
          }
        }
        return null;
      }
  
      if (isRemux) {
        for (const [tier, names] of Object.entries(releaseGroups.remux)) {
          for (const name of names) {
            const pattern = new RegExp(`[\\.-]${name}[\\.-]?`, 'i');
            if (pattern.test(text)) {
              return { type: 'remux', tier, group: name };
            }
          }
        }
        return null;
      }
  
      if (is4k) {
        for (const [tier, names] of Object.entries(releaseGroups["4kencode"])) {
          for (const name of names) {
            const pattern = new RegExp(`[\\.-]${name}[\\.-]?`, 'i');
            if (pattern.test(text)) {
              return { type: '4kencode', tier, group: name };
            }
          }
        }
      }
  
      for (const [tier, names] of Object.entries(releaseGroups.encode)) {
        for (const name of names) {
          const pattern = new RegExp(`[\\.-]${name}[\\.-]?`, 'i');
          if (pattern.test(text)) {
            return { type: 'encode', tier, group: name };
          }
        }
      }
  
      return null;
    }
  
    function createSpan(text) {
      const span = document.createElement('span');
      span.textContent = text.toUpperCase();
      span.className = '__releaseTag';
      span.style.backgroundColor = 'white';
      span.style.color = 'red';
      span.style.padding = '2px 5px';
      span.style.marginRight = '10px';
      span.style.fontSize = '0.75rem';
      span.style.borderRadius = '4px';
      span.style.fontWeight = 'bold';
      span.style.verticalAlign = 'middle';
      return span;
    }
  
    function processH2s(resolution) {
      const h2s = document.querySelectorAll('h2');
      const groupedEntries = { remux: [], "4kencode": [], encode: [], web: [] };
  
      h2s.forEach(h2 => {
        const text = h2.textContent;
        if (!text || !text.includes(resolution)) return;
        if (h2.classList.contains('__tagged')) return;
  
        const match = getMatchInfo(text);
        if (!match) return;
  
        h2.classList.add('__tagged');
        h2.style.backgroundColor = tierColors[match.tier];
        h2.style.paddingRight = '1em';
        h2.style.color = 'black';
        h2.style.padding = '4px';
        h2.style.borderRadius = '8px';
        h2.style.display = 'flex';
        h2.style.flexWrap = 'wrap';
  
        h2.appendChild(createSpan(resolution));
        h2.appendChild(createSpan(match.type));
        h2.appendChild(createSpan(`Tier ${match.tier.charAt(4)}`));
        if (/\bDV\b/i.test(text)) h2.appendChild(createSpan("DV"));
        if (/\bHDR\b/i.test(text)) h2.appendChild(createSpan("HDR"));
  
        groupedEntries[match.type].push({ element: h2, tier: match.tier, dvHdr: /\bDV\b/i.test(text), hdr: /\bHDR\b/i.test(text) });
      });
  
      const sortedEntries = [
        ...groupedEntries.web.sort(compareEntries),
        ...groupedEntries.encode.sort(compareEntries),
        ...groupedEntries["4kencode"].sort(compareEntries),
        ...groupedEntries.remux.sort(compareEntries)
      ];
  
      sortedEntries.forEach(item => {
        const parentDiv = item.element.closest('.border-2');
        if (parentDiv && parentDiv.parentElement) {
          parentDiv.parentElement.insertBefore(parentDiv, parentDiv.parentElement.firstChild);
        }
      });
    }
  
    function compareEntries(a, b) {
      if (a.tier !== b.tier) return b.tier.localeCompare(a.tier);
      if (a.dvHdr !== b.dvHdr) return a.dvHdr - b.dvHdr;
      return a.hdr - b.hdr;
    }
  
    function runProcessing() {
      processH2s('720p');
      processH2s('1080i');
      processH2s('1080p');
      processH2s('2160p');
    }
  
    function isMobileDevice() {
      return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    }
  
    function waitForLoadingToFinish(callback) {
      const interval = setInterval(() => {
        const loadingEl = [...document.querySelectorAll('div')]
          .find(div => div.textContent.trim() === 'Loading...');
        if (!loadingEl) {
          clearInterval(interval);
          callback();
        }
      }, 1000);
    }
  
    function handleRouteChange() {
      waitForLoadingToFinish(() => {
        runProcessing();
        if (isMobileDevice()) {
          let attempts = 0;
          const maxAttempts = 5;
          const retryInterval = setInterval(() => {
            runProcessing();
            attempts++;
            if (attempts >= maxAttempts) clearInterval(retryInterval);
          }, 3000);
        }
      });
    }
  
    function patchHistoryMethods() {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
  
      function fireRouteChange() {
        setTimeout(handleRouteChange, 500);
      }
  
      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        fireRouteChange();
      };
      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        fireRouteChange();
      };
  
      window.addEventListener('popstate', fireRouteChange);
    }
  
    function removeLineClampClass() {
      document.querySelectorAll('.line-clamp-2').forEach(el => el.classList.remove('line-clamp-2'));
    }
  
    window.addEventListener('load', () => {
      patchHistoryMethods();
      handleRouteChange();
      removeLineClampClass();
      setInterval(removeLineClampClass, 1000);
    });
  
  })();
  
