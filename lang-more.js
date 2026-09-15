(function () {
  var S = {
    'es-ES': { name: 'Spanish (Spain)', nativeName: 'Espa\u00f1ol (Espa\u00f1a)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntuaci\u00f3n', lives: 'Vidas', best: 'R\u00e9cord', keys: 'Llaves',
      totalXp: 'XP Total', howToPlay: 'C\u00f3mo jugar', language: 'Idioma',
      retry: 'REINTENTAR', mainMenu: 'MEN\u00da PRINCIPAL', gameOver: 'FIN DEL JUEGO',
      youWin: '\u00a1GANASTE!', raceOver: 'CARRERA TERMINADA', levelCleared: '\u00a1NIVEL COMPLETADO!',
      xpEarned: '+{xp} XP', timeRanOut: '\u00a1Tiempo agotado!',
      diffBeginner: 'Principiante', diffEasy: 'F\u00e1cil', diffNormal: 'Normal', diffHard: 'Dif\u00edcil',
      diffExpert: 'Experto', diffMaster: 'Maestro', diffWizard: 'Mago', diffInsane: 'Loco',
      diffLegend: 'Leyenda', diffGod: 'Dios',
      raceTabCpu: 'vs CPU', raceTabOnline: 'En l\u00ednea', raceReady: 'Listo', raceLeave: 'Salir',
      raceAgain: 'Otra carrera', raceMainMenu: 'Men\u00fa principal', tutClose: '\u00a1Entendido!',
      raceCreateRoom: 'Crear sala', raceJoinRoom: 'Unirse a sala', raceBack: 'Atr\u00e1s',
      raceLobby: 'Sala de espera', raceStandings: 'Clasificaci\u00f3n', raceEliminated: '\u00a1ELIMINADO!',
      raceStart: 'Empezar carrera', racePlayerName: 'Tu nombre',
      scoreDisplay: 'Puntuaci\u00f3n: {score}', livesDisplay: 'Vidas: {n}',
      bestDisplay: 'R\u00e9cord: {score}', xpDisplay: 'XP Total: {xp}',
      keysDisplay: 'Llaves: {n}', selectDifficulty: 'Seleccionar dificultad',
      selectLevel: 'Seleccionar nivel', slowMotion: '\u00a1C\u00c1MARA LENTA!',
      blasterActive: '\u00a1BLASTER ACTIVO!', speedBoost: '\u00a1ACELERACI\u00d3N!',
      speedReduction: '\u00a1DESACELERACI\u00d3N!', installApp: 'A\u00f1adir a pantalla de inicio',
      wins: '\u00a1{name} GANA!', raceYou: '(t\u00fa)'
    }},
    'es-MX': { name: 'Spanish (Mexico)', nativeName: 'Espa\u00f1ol (M\u00e9xico)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntuaci\u00f3n', lives: 'Vidas', best: 'R\u00e9cord', keys: 'Llaves',
      howToPlay: 'C\u00f3mo jugar', language: 'Idioma', retry: 'REINTENTAR',
      mainMenu: 'MEN\u00da PRINCIPAL', gameOver: 'JUEGO TERMINADO', youWin: '\u00a1GANASTE!',
      diffBeginner: 'Principiante', diffEasy: 'F\u00e1cil', diffNormal: 'Normal', raceReady: 'Listo',
      tutClose: '\u00a1Entendido!', scoreDisplay: 'Puntuaci\u00f3n: {score}',
      livesDisplay: 'Vidas: {n}', bestDisplay: 'R\u00e9cord: {score}', xpDisplay: 'XP Total: {xp}'
    }},
    'es-AR': { name: 'Spanish (Argentina)', nativeName: 'Espa\u00f1ol (Argentina)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntos', lives: 'Vidas', best: 'R\u00e9cord',
      howToPlay: 'C\u00f3mo jugar', language: 'Idioma', retry: 'REINTENTAR',
      mainMenu: 'MEN\u00da PRINCIPAL', gameOver: 'JUEGO TERMINADO', youWin: '\u00a1GANASTE!',
      raceReady: 'Listo', tutClose: '\u00a1Entendido!',
      scoreDisplay: 'Puntos: {score}', livesDisplay: 'Vidas: {n}', bestDisplay: 'R\u00e9cord: {score}'
    }},
    'pt-PT': { name: 'Portuguese (Portugal)', nativeName: 'Portugu\u00eas (Portugal)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Pontua\u00e7\u00e3o', lives: 'Vidas', best: 'Melhor', keys: 'Chaves',
      totalXp: 'XP Total', howToPlay: 'Como jogar', language: 'Idioma',
      retry: 'TENTAR NOVAMENTE', mainMenu: 'MENU PRINCIPAL', gameOver: 'FIM DO JOGO',
      youWin: 'VOC\u00ca GANHOU!', raceOver: 'CORRIDA TERMINADA',
      diffBeginner: 'Iniciante', diffEasy: 'F\u00e1cil', diffNormal: 'Normal', diffHard: 'Dif\u00edcil',
      raceReady: 'Pronto', raceAgain: 'Nova corrida', raceMainMenu: 'Menu principal', tutClose: 'Percebi!',
      scoreDisplay: 'Pontua\u00e7\u00e3o: {score}', livesDisplay: 'Vidas: {n}',
      bestDisplay: 'Melhor: {score}', xpDisplay: 'XP Total: {xp}'
    }},
    'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Portugu\u00eas (Brasil)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Pontua\u00e7\u00e3o', lives: 'Vidas', best: 'Melhor', keys: 'Chaves',
      totalXp: 'XP Total', howToPlay: 'Como jogar', language: 'Idioma',
      retry: 'TENTAR NOVAMENTE', mainMenu: 'MENU PRINCIPAL', gameOver: 'FIM DE JOGO',
      youWin: 'VOC\u00ca VENCEU!', raceOver: 'CORRIDA ENCERRADA',
      diffBeginner: 'Iniciante', diffEasy: 'F\u00e1cil', diffNormal: 'Normal', diffHard: 'Dif\u00edcil',
      diffExpert: 'Especialista', diffMaster: 'Mestre',
      raceTabCpu: 'vs CPU', raceTabOnline: 'Online', raceReady: 'Pronto', raceLeave: 'Sair',
      raceAgain: 'Nova corrida', raceMainMenu: 'Menu principal', tutClose: 'Entendi!',
      raceCreateRoom: 'Criar sala', raceJoinRoom: 'Entrar na sala', raceBack: 'Voltar',
      raceStandings: 'Classifica\u00e7\u00e3o', raceEliminated: 'ELIMINADO!',
      scoreDisplay: 'Pontua\u00e7\u00e3o: {score}', livesDisplay: 'Vidas: {n}',
      bestDisplay: 'Melhor: {score}', xpDisplay: 'XP Total: {xp}',
      keysDisplay: 'Chaves: {n}', wins: '{name} VENCEU!',
      slowMotion: 'C\u00c2MERA LENTA!', blasterActive: 'BLASTER ATIVO!',
      speedBoost: 'ACELERA\u00c7\u00c3O!', speedReduction: 'DESACELERA\u00c7\u00c3O!',
      selectDifficulty: 'Selecionar dificuldade', selectLevel: 'Selecionar n\u00edvel'
    }},
    'de-DE': { name: 'German (Germany)', nativeName: 'Deutsch (Deutschland)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punktzahl', lives: 'Leben', best: 'Beste', keys: 'Schl\u00fcssel',
      totalXp: 'Gesamt-XP', howToPlay: 'Spielanleitung', language: 'Sprache',
      retry: 'WIEDERHOLEN', mainMenu: 'HAUPTMEN\u00dc', gameOver: 'SPIEL VORBEI',
      youWin: 'DU GEWINNST!', raceOver: 'RENNEN VORBEI', levelCleared: 'LEVEL GESCHAFFT!',
      xpEarned: '+{xp} XP', timeRanOut: 'Zeit abgelaufen!',
      diffBeginner: 'Anf\u00e4nger', diffEasy: 'Leicht', diffNormal: 'Normal', diffHard: 'Schwer',
      diffExpert: 'Experte', diffMaster: 'Meister', diffWizard: 'Zauberer', diffInsane: 'Wahnsinn',
      diffLegend: 'Legende', diffGod: 'Gott',
      raceTabCpu: 'gegen CPU', raceTabOnline: 'Online', raceReady: 'Bereit', raceLeave: 'Verlassen',
      raceAgain: 'Nochmal', raceMainMenu: 'Hauptmen\u00fc', tutClose: 'Verstanden!',
      raceCreateRoom: 'Raum erstellen', raceJoinRoom: 'Raum beitreten', raceBack: 'Zur\u00fcck',
      raceLobby: 'Wartehalle', raceStandings: 'Rangliste', raceEliminated: 'ELIMINIERT!',
      racePlayerName: 'Dein Name', racePlayerCount: 'Spieler (2\u20135)',
      scoreDisplay: 'Punktzahl: {score}', livesDisplay: 'Leben: {n}',
      bestDisplay: 'Beste: {score}', xpDisplay: 'Gesamt-XP: {xp}',
      keysDisplay: 'Schl\u00fcssel: {n}', selectDifficulty: 'Schwierigkeit w\u00e4hlen',
      selectLevel: 'Level w\u00e4hlen', slowMotion: 'ZEITLUPE!', blasterActive: 'BLASTER AKTIV!',
      speedBoost: 'BESCHLEUNIGUNG!', speedReduction: 'VERLANGSAMUNG!',
      installApp: 'Zum Startbildschirm hinzuf\u00fcgen', wins: '{name} GEWINNT!',
      raceYou: '(du)', raceSurvived: 'Hat \u00fcberlebt', raceEliminatedStatus: 'Eliminiert'
    }},
    'ru-RU': { name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u041e\u0447\u043a\u0438', lives: '\u0416\u0438\u0437\u043d\u0438', best: '\u041b\u0443\u0447\u0448\u0438\u0439', keys: '\u041a\u043b\u044e\u0447\u0438',
      totalXp: '\u0412\u0441\u0435\u0433\u043e XP', howToPlay: '\u041a\u0430\u043a \u0438\u0433\u0440\u0430\u0442\u044c', language: '\u042f\u0437\u044b\u043a',
      retry: '\u041f\u041e\u041f\u0420\u041e\u0411\u041e\u0412\u0410\u0422\u042c \u0421\u041d\u041e\u0412\u0410',
      mainMenu: '\u0413\u041b\u0410\u0412\u041d\u041e\u0415 \u041c\u0415\u041d\u042e', gameOver: '\u0418\u0413\u0420\u0410 \u041e\u041a\u041e\u041d\u0427\u0415\u041d\u0410',
      youWin: '\u0412\u042b \u041f\u041e\u0411\u0415\u0414\u0418\u041b\u0418!', raceOver: '\u0413\u041e\u041d\u041a\u0410 \u041e\u041a\u041e\u041d\u0427\u0415\u041d\u0410',
      diffBeginner: '\u041d\u043e\u0432\u0438\u0447\u043e\u043a', diffEasy: '\u041b\u0435\u0433\u043a\u043e', diffNormal: '\u041d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u043e',
      diffHard: '\u0421\u043b\u043e\u0436\u043d\u043e', diffExpert: '\u042d\u043a\u0441\u043f\u0435\u0440\u0442', diffMaster: '\u041c\u0430\u0441\u0442\u0435\u0440',
      diffWizard: '\u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0438\u043a', diffInsane: '\u0411\u0435\u0437\u0443\u043c\u0438\u0435',
      diffLegend: '\u041b\u0435\u0433\u0435\u043d\u0434\u0430', diffGod: '\u0411\u043e\u0433',
      raceReady: '\u0413\u043e\u0442\u043e\u0432', raceAgain: '\u0415\u0449\u0451 \u0433\u043e\u043d\u043a\u0430',
      raceMainMenu: '\u0413\u043b\u0430\u0432\u043d\u043e\u0435 \u043c\u0435\u043d\u044e', tutClose: '\u041f\u043e\u043d\u044f\u043b!',
      raceCreateRoom: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043a\u043e\u043c\u043d\u0430\u0442\u0443', raceJoinRoom: '\u041f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c\u0441\u044f',
      raceBack: '\u041d\u0430\u0437\u0430\u0434', raceLobby: '\u041b\u043e\u0431\u0431\u0438', raceStandings: '\u0422\u0430\u0431\u043b\u0438\u0446\u0430',
      raceEliminated: '\u0412\u042b\u0411\u042b\u041b!', raceStart: '\u041d\u0430\u0447\u0430\u0442\u044c \u0433\u043e\u043d\u043a\u0443',
      racePlayerName: '\u0412\u0430\u0448\u0435 \u0438\u043c\u044f', selectDifficulty: '\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0441\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u044c',
      scoreDisplay: '\u041e\u0447\u043a\u0438: {score}', livesDisplay: '\u0416\u0438\u0437\u043d\u0438: {n}',
      bestDisplay: '\u041b\u0443\u0447\u0448\u0438\u0439: {score}', xpDisplay: '\u0412\u0441\u0435\u0433\u043e XP: {xp}',
      keysDisplay: '\u041a\u043b\u044e\u0447\u0438: {n}',
      slowMotion: '\u0417\u0410\u041c\u0415\u0414\u041b\u0415\u041d\u0418\u0415!', blasterActive: '\u0411\u041b\u0410\u0421\u0422\u0415\u0420 \u0410\u041a\u0422\u0418\u0412\u0415\u041d!',
      speedBoost: '\u0423\u0421\u041a\u041e\u0420\u0415\u041d\u0418\u0415!', speedReduction: '\u0417\u0410\u041c\u0415\u0414\u041b\u0415\u041d\u0418\u0415!',
      wins: '{name} \u041f\u041e\u0411\u0415\u0416\u0414\u0410\u0415\u0422!', raceYou: '(\u0432\u044b)',
      levelCleared: '\u0423\u0420\u041e\u0412\u0415\u041d\u042c \u041f\u0420\u041e\u0419\u0414\u0415\u041d!',
      xpEarned: '+{xp} XP', timeRanOut: '\u0412\u0440\u0435\u043c\u044f \u0432\u044b\u0448\u043b\u043e!'
    }},
    'zh-CN': { name: 'Chinese (Simplified)', nativeName: '\u4e2d\u6587\uff08\u7b80\u4f53\uff09', dir: 'ltr', s: {
      title: '\u6c90\u5149\u8eb2\u907f\u8005', score: '\u5f97\u5206', lives: '\u751f\u547d', best: '\u6700\u4f73', keys: '\u94a5\u5319',
      totalXp: '\u603bXP', howToPlay: '\u5982\u4f55\u73a9', language: '\u8bed\u8a00',
      retry: '\u91cd\u8bd5', mainMenu: '\u4e3b\u83dc\u5355', gameOver: '\u6e38\u620f\u7ed3\u675f',
      youWin: '\u4f60\u8d62\u4e86\uff01', raceOver: '\u6bd4\u8d5b\u7ed3\u675f',
      diffBeginner: '\u65b0\u624b', diffEasy: '\u7b80\u5355', diffNormal: '\u666e\u901a', diffHard: '\u56f0\u96be',
      diffExpert: '\u4e13\u5bb6', diffMaster: '\u5927\u5e08', diffWizard: '\u9b54\u6cd5\u5e08', diffInsane: '\u75af\u72c2',
      diffLegend: '\u4f20\u5947', diffGod: '\u795e',
      raceReady: '\u51c6\u5907\u597d', raceAgain: '\u518d\u8d5b\u4e00\u573a', raceMainMenu: '\u4e3b\u83dc\u5355',
      tutClose: '\u660e\u767d\u4e86\uff01',
      scoreDisplay: '\u5f97\u5206\uff1a{score}', livesDisplay: '\u751f\u547d\uff1a{n}',
      bestDisplay: '\u6700\u4f73\uff1a{score}', xpDisplay: '\u603bXP\uff1a{xp}',
      keysDisplay: '\u94a5\u5319\uff1a{n}', selectDifficulty: '\u9009\u62e9\u96be\u5ea6',
      selectLevel: '\u9009\u62e9\u5173\u5361', levelCleared: '\u5173\u5361\u901a\u5173\uff01',
      xpEarned: '+{xp} XP', timeRanOut: '\u65f6\u95f4\u5230\uff01',
      raceCreateRoom: '\u521b\u5efa\u623f\u95f4', raceJoinRoom: '\u52a0\u5165\u623f\u95f4',
      raceBack: '\u8fd4\u56de', raceLobby: '\u7b49\u5f85\u5385', raceStandings: '\u6392\u540d',
      raceEliminated: '\u6dd8\u6c70\uff01', racePlayerName: '\u4f60\u7684\u540d\u5b57',
      raceTabCpu: '\u5bf9\u7535\u8111', raceTabOnline: '\u5728\u7ebf'
    }},
    'zh-TW': { name: 'Chinese (Traditional)', nativeName: '\u4e2d\u6587\uff08\u7e41\u9ad4\uff09', dir: 'ltr', s: {
      title: '\u6c90\u5149\u8eb2\u907f\u8005', score: '\u5f97\u5206', lives: '\u751f\u547d', best: '\u6700\u4f73', keys: '\u9470\u5319',
      totalXp: '\u7e3dXP', howToPlay: '\u5982\u4f55\u73a9', language: '\u8a9e\u8a00',
      retry: '\u91cd\u8a66', mainMenu: '\u4e3b\u9078\u55ae', gameOver: '\u904a\u6232\u7d50\u675f',
      youWin: '\u4f60\u8d0f\u4e86\uff01', raceOver: '\u6bd4\u8cfd\u7d50\u675f',
      diffBeginner: '\u65b0\u624b', diffEasy: '\u7c21\u55ae', diffNormal: '\u666e\u901a', diffHard: '\u56f0\u96e3',
      raceReady: '\u6e96\u5099\u597d', raceAgain: '\u518d\u8cfd\u4e00\u5834', raceMainMenu: '\u4e3b\u9078\u55ae',
      tutClose: '\u660e\u767d\u4e86\uff01', scoreDisplay: '\u5f97\u5206\uff1a{score}', livesDisplay: '\u751f\u547d\uff1a{n}',
      bestDisplay: '\u6700\u4f73\uff1a{score}', xpDisplay: '\u7e3dXP\uff1a{xp}'
    }},
    'ja-JP': { name: 'Japanese', nativeName: '\u65e5\u672c\u8a9e', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u30b9\u30b3\u30a2', lives: '\u751f\u547d', best: '\u6700\u9ad8\u5f97\u70b9', keys: '\u9375',
      totalXp: 'XP \u5408\u8a08', howToPlay: '\u904a\u3073\u65b9', language: '\u8a00\u8a9e',
      retry: '\u3082\u3046\u4e00\u5ea6', mainMenu: '\u30e1\u30a4\u30f3\u30e1\u30cb\u30e5\u30fc', gameOver: '\u30b2\u30fc\u30e0\u30aa\u30fc\u30d0\u30fc',
      youWin: '\u3042\u306a\u305f\u306e\u52dd\u3061!', raceOver: '\u30ec\u30fc\u30b9\u7d42\u4e86',
      diffBeginner: '\u521d\u5fc3\u8005', diffEasy: '\u7c21\u5358', diffNormal: '\u666e\u901a', diffHard: '\u96e3\u3057\u3044',
      diffExpert: '\u9054\u4eba', diffMaster: '\u30de\u30b9\u30bf\u30fc', diffWizard: '\u9b54\u6cd5\u4f7f\u3044',
      diffInsane: '\u72c2\u6c17', diffLegend: '\u4f1d\u8aac', diffGod: '\u795e',
      raceReady: '\u6e96\u5099OK', raceAgain: '\u3082\u3046\u4e00\u5ea6\u30ec\u30fc\u30b9', raceMainMenu: '\u30e1\u30a4\u30f3\u30e1\u30cb\u30e5\u30fc',
      tutClose: '\u308f\u304b\u3063\u305f!',
      scoreDisplay: '\u30b9\u30b3\u30a2: {score}', livesDisplay: '\u751f\u547d: {n}',
      bestDisplay: '\u6700\u9ad8\u5f97\u70b9: {score}', xpDisplay: 'XP \u5408\u8a08: {xp}',
      keysDisplay: '\u9375: {n}', selectDifficulty: '\u96e3\u5ea6\u3092\u9078\u629e',
      raceCreateRoom: '\u30eb\u30fc\u30e0\u3092\u4f5c\u6210', raceJoinRoom: '\u30eb\u30fc\u30e0\u306b\u53c2\u52a0',
      raceBack: '\u623b\u308b', raceStandings: '\u9806\u4f4d', raceEliminated: '\u632f\u308a\u843d\u3068\u3055\u308c\u305f!',
      levelCleared: '\u30ec\u30d9\u30eb\u30af\u30ea\u30a2!', xpEarned: '+{xp} XP',
      wins: '{name} \u306e\u52dd\u3061!', raceYou: '(\u3042\u306a\u305f)'
    }},
    'ko-KR': { name: 'Korean', nativeName: '\ud55c\uad6d\uc5b4', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\uc810\uc218', lives: '\ubaa9\uc22b', best: '\ucd5c\uace0', keys: '\uc5f4\uc1e0',
      totalXp: '\ucd1d XP', howToPlay: '\ud50c\ub808\uc774 \ubc29\ubc95', language: '\uc5b8\uc5b4',
      retry: '\ub2e4\uc2dc \uc2dc\ub3c4', mainMenu: '\uba54\uc778 \uba54\ub274', gameOver: '\uac8c\uc784 \uc624\ubc84',
      youWin: '\ub2f9\uc2e0\uc758 \uc2b9\ub9ac!', raceOver: '\uacbd\uae30 \uc885\ub8cc',
      diffBeginner: '\ucd08\ubcf4', diffEasy: '\uc26c\uc6c0', diffNormal: '\ubcf4\ud1b5', diffHard: '\uc5b4\ub824\uc6c0',
      diffExpert: '\uc804\ubb38\uac00', diffMaster: '\ub9c8\uc2a4\ud130', diffWizard: '\ub9c8\ubc95\uc0ac',
      diffInsane: '\ubbf8\uce5c', diffLegend: '\uc804\uc124', diffGod: '\uc2e0',
      raceReady: '\uc900\ube44 \uc644\ub8cc', raceAgain: '\ub2e4\uc2dc \uacbd\uae30', raceMainMenu: '\uba54\uc778 \uba54\ub274',
      tutClose: '\uc54c\uaca0\uc5b4\uc694!',
      scoreDisplay: '\uc810\uc218: {score}', livesDisplay: '\ubaa9\uc22b: {n}',
      bestDisplay: '\ucd5c\uace0: {score}', xpDisplay: '\ucd1d XP: {xp}',
      keysDisplay: '\uc5f4\uc1e0: {n}', selectDifficulty: '\ub09c\uc774\ub3c4 \uc120\ud0dd',
      levelCleared: '\ub808\ubca8 \ud074\ub9ac\uc5b4!', raceCreateRoom: '\ubc29 \uc0dd\uc131',
      raceJoinRoom: '\ubc29 \ucc38\uac00', raceBack: '\ub4a4\ub85c', raceStandings: '\uc21c\uc704',
      raceEliminated: '\ud0c8\ub77d!'
    }},
    'it-IT': { name: 'Italian', nativeName: 'Italiano', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punteggio', lives: 'Vite', best: 'Migliore', keys: 'Chiavi',
      totalXp: 'XP Totali', howToPlay: 'Come giocare', language: 'Lingua',
      retry: 'RIPROVA', mainMenu: 'MENU PRINCIPALE', gameOver: 'FINE PARTITA',
      youWin: 'HAI VINTO!', raceOver: 'GARA TERMINATA',
      diffBeginner: 'Principiante', diffEasy: 'Facile', diffNormal: 'Normale', diffHard: 'Difficile',
      diffExpert: 'Esperto', diffMaster: 'Maestro', diffWizard: 'Mago', diffInsane: 'Folle',
      diffLegend: 'Leggenda', diffGod: 'Dio',
      raceReady: 'Pronto', raceAgain: 'Ancora gara', raceMainMenu: 'Menu principale', tutClose: 'Ho capito!',
      scoreDisplay: 'Punteggio: {score}', livesDisplay: 'Vite: {n}',
      bestDisplay: 'Migliore: {score}', xpDisplay: 'XP Totali: {xp}',
      keysDisplay: 'Chiavi: {n}', selectDifficulty: 'Seleziona difficolt\u00e0',
      raceCreateRoom: 'Crea stanza', raceJoinRoom: 'Entra in stanza', raceBack: 'Indietro',
      raceStandings: 'Classifica', raceEliminated: 'ELIMINATO!', raceLobby: 'Sala d\'attesa',
      racePlayerName: 'Il tuo nome', slowMotion: 'RALLENTI!', blasterActive: 'BLASTER ATTIVO!',
      speedBoost: 'ACCELERAZIONE!', speedReduction: 'DECELERAZIONE!', wins: '{name} VINCE!'
    }},
    'nl-NL': { name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Score', lives: 'Levens', best: 'Beste', keys: 'Sleutels',
      howToPlay: 'Hoe te spelen', language: 'Taal',
      retry: 'OPNIEUW', mainMenu: 'HOOFDMENU', gameOver: 'SPEL AFGELOPEN',
      youWin: 'JIJ WINT!', diffBeginner: 'Beginner', diffEasy: 'Makkelijk', diffNormal: 'Normaal',
      diffHard: 'Moeilijk', raceReady: 'Klaar', raceAgain: 'Nog een race', raceMainMenu: 'Hoofdmenu',
      tutClose: 'Begrepen!', scoreDisplay: 'Score: {score}', livesDisplay: 'Levens: {n}',
      bestDisplay: 'Beste: {score}', xpDisplay: 'XP Totaal: {xp}'
    }},
    'tr-TR': { name: 'Turkish', nativeName: 'T\u00fcrk\u00e7e', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puan', lives: 'Can', best: 'En \u0130yi', keys: 'Anahtarlar',
      totalXp: 'Toplam XP', howToPlay: 'Nas\u0131l oynan\u0131r', language: 'Dil',
      retry: 'TEKRAR DENE', mainMenu: 'ANA MEN\u00dc', gameOver: 'OYUN B\u0130TT\u0130',
      youWin: 'KAZANDIN!', raceOver: 'YARI\u015e B\u0130TT\u0130',
      diffBeginner: 'Acemi', diffEasy: 'Kolay', diffNormal: 'Normal', diffHard: 'Zor',
      diffExpert: 'Uzman', diffMaster: 'Usta', diffWizard: 'B\u00fcy\u00fcc\u00fc', diffInsane: '\u00c7\u0131lg\u0131n',
      diffLegend: 'Efsane', diffGod: 'Tanr\u0131',
      raceReady: 'Haz\u0131r', raceAgain: 'Tekrar yar\u0131\u015f', raceMainMenu: 'Ana men\u00fc',
      tutClose: 'Anlad\u0131m!', scoreDisplay: 'Puan: {score}', livesDisplay: 'Can: {n}',
      bestDisplay: 'En \u0130yi: {score}', xpDisplay: 'Toplam XP: {xp}',
      keysDisplay: 'Anahtar: {n}', selectDifficulty: 'Zorluk se\u00e7',
      raceCreateRoom: 'Oda olu\u015ftur', raceJoinRoom: 'Odaya kat\u0131l', raceBack: 'Geri',
      raceStandings: 'S\u0131ralama', raceEliminated: 'ELEND\u0130N!',
      levelCleared: 'SEV\u0130YE TAMAMLANDI!', xpEarned: '+{xp} XP',
      wins: '{name} KAZANDI!', raceYou: '(sen)'
    }},
    'fa-IR': { name: 'Persian', nativeName: '\u0641\u0627\u0631\u0633\u06cc', dir: 'rtl', s: {
      title: '\u0646\u06cc\u0648\u0646 \u062f\u0627\u062c\u0631\u0632', score: '\u0627\u0645\u062a\u06cc\u0627\u0632', lives: '\u062c\u0627\u0646\u200c\u0647\u0627',
      best: '\u0628\u0647\u062a\u0631\u06cc\u0646', keys: '\u06a9\u0644\u06cc\u062f\u0647\u0627',
      howToPlay: '\u0686\u06af\u0648\u0646\u06af\u06cc \u0628\u0627\u0632\u06cc', language: '\u0632\u0628\u0627\u0646',
      retry: '\u062f\u0648\u0628\u0627\u0631\u0647', mainMenu: '\u0645\u0646\u0648\u06cc \u0627\u0635\u0644\u06cc', gameOver: '\u067e\u0627\u06cc\u0627\u0646 \u0628\u0627\u0632\u06cc',
      youWin: '\u0634\u0645\u0627 \u0628\u0631\u0646\u062f\u0647 \u0634\u062f\u06cc\u062f!',
      diffBeginner: '\u0645\u0628\u062a\u062f\u06cc', diffEasy: '\u0622\u0633\u0627\u0646', diffNormal: '\u0645\u0639\u0645\u0648\u0644\u06cc', diffHard: '\u0633\u062e\u062a',
      raceReady: '\u0622\u0645\u0627\u062f\u0647', tutClose: '\u0641\u0647\u0645\u06cc\u062f\u0645!',
      scoreDisplay: '\u0627\u0645\u062a\u06cc\u0627\u0632: {score}', livesDisplay: '\u062c\u0627\u0646\u200c\u0647\u0627: {n}',
      bestDisplay: '\u0628\u0647\u062a\u0631\u06cc\u0646: {score}'
    }},
    'ku-TR': { name: 'Kurdish (Kurmanji)', nativeName: 'Kurd\u00ee (Kurmanci)', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puan', lives: 'Jiyan', best: 'Ba\u015ftir\u00een', keys: 'Mifte',
      howToPlay: 'Meriv \u00e7awa dil\u00eest', language: 'Ziman',
      retry: 'D\u00dbCAR BICERIB\u00ceNE', mainMenu: 'MEN\u00dbYA SEREK\u00ce', gameOver: 'L\u00ceST\u00ceK QED\u00ceYA',
      youWin: 'TU KAZANDIN!', diffBeginner: 'Destp\u00eak', diffEasy: 'Hesab', diffNormal: 'Normal',
      raceReady: 'Amade', tutClose: 'T\u00ea \u00e7\u00fbya!',
      scoreDisplay: 'Puan: {score}', livesDisplay: 'Jiyan: {n}', bestDisplay: 'Ba\u015ftir\u00een: {score}'
    }},
    'el-GR': { name: 'Greek', nativeName: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0392\u03b1\u03b8\u03bc\u03bf\u03bb\u03bf\u03b3\u03af\u03b1', lives: '\u0396\u03c9\u03ad\u03c2',
      best: '\u039a\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03bf', keys: '\u039a\u03bb\u03b5\u03b9\u03b4\u03b9\u03ac',
      howToPlay: '\u03a0\u03c9\u03c2 \u03bd\u03b1 \u03c0\u03b1\u03af\u03be\u03b5\u03c4\u03b5', language: '\u0393\u03bb\u03ce\u03c3\u03c3\u03b1',
      retry: '\u0394\u039f\u039a\u0399\u039c\u0391\u03a3\u03a4\u0395 \u039e\u0391\u039d\u0391',
      mainMenu: '\u039a\u03a5\u03a1\u0399\u0391 \u039c\u0395\u039d\u039f\u03a5', gameOver: '\u03a4\u0395\u039b\u039f\u03a3 \u03a0\u0391\u0399\u03a7\u039d\u0399\u0394\u0399\u039f\u03a5',
      youWin: '\u039d\u0399\u039a\u0397\u03a3\u0395\u03a3!',
      diffBeginner: '\u0391\u03c1\u03c7\u03ac\u03c1\u03b9\u03bf\u03c2', diffEasy: '\u0395\u03cd\u03ba\u03bf\u03bb\u03bf', diffNormal: '\u039a\u03b1\u03bd\u03bf\u03bd\u03b9\u03ba\u03cc',
      diffHard: '\u0394\u03cd\u03c3\u03ba\u03bf\u03bb\u03bf', raceReady: '\u0388\u03c4\u03bf\u03b9\u03bc\u03bf\u03c2', tutClose: '\u039a\u03b1\u03c4\u03ac\u03bb\u03b1\u03b2\u03b1!',
      scoreDisplay: '\u0392\u03b1\u03b8\u03bc\u03bf\u03bb\u03bf\u03b3\u03af\u03b1: {score}', livesDisplay: '\u0396\u03c9\u03ad\u03c2: {n}',
      bestDisplay: '\u039a\u03b1\u03bb\u03cd\u03c4\u03b5\u03c1\u03bf: {score}'
    }},
    'he-IL': { name: 'Hebrew', nativeName: '\u05e2\u05d1\u05e8\u05d9\u05ea', dir: 'rtl', s: {
      title: 'NEON DODGERS', score: '\u05e0\u05e7\u05d5\u05d3\u05d5\u05ea', lives: '\u05d7\u05d9\u05d9\u05dd', best: '\u05d4\u05db\u05d9 \u05d8\u05d5\u05d1', keys: '\u05de\u05e4\u05ea\u05d7\u05d5\u05ea',
      howToPlay: '\u05d0\u05d9\u05da \u05dc\u05e9\u05d7\u05e7', language: '\u05e9\u05e4\u05d4',
      retry: '\u05e0\u05e1\u05d4 \u05e9\u05d5\u05d1', mainMenu: '\u05ea\u05e4\u05e8\u05d9\u05d8 \u05e8\u05d0\u05e9\u05d9', gameOver: '\u05d4\u05de\u05e9\u05d7\u05e7 \u05e0\u05d2\u05de\u05e8',
      youWin: '\u05e0\u05e6\u05d7\u05ea!',
      diffBeginner: '\u05de\u05ea\u05d7\u05d9\u05dc', diffEasy: '\u05e7\u05dc', diffNormal: '\u05e8\u05d2\u05d9\u05dc', diffHard: '\u05e7\u05e9\u05d4',
      raceReady: '\u05de\u05d5\u05db\u05df', tutClose: '\u05d4\u05d1\u05e0\u05ea\u05d9!',
      scoreDisplay: '\u05e0\u05e7\u05d5\u05d3\u05d5\u05ea: {score}', livesDisplay: '\u05d7\u05d9\u05d9\u05dd: {n}',
      bestDisplay: '\u05d4\u05db\u05d9 \u05d8\u05d5\u05d1: {score}'
    }},
    'hi-IN': { name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0905\u0902\u0915', lives: '\u091c\u0940\u0935\u0928', best: '\u0938\u092c\u0938\u0947 \u0905\u091a\u094d\u091b\u093e', keys: '\u091a\u093e\u092c\u093f\u092f\u093e\u0901',
      howToPlay: '\u0915\u0948\u0938\u0947 \u0916\u0947\u0932\u0947\u0902', language: '\u092d\u093e\u0937\u093e',
      retry: '\u092a\u0941\u0928\u094d\u0939 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902', mainMenu: '\u092e\u0941\u0916\u094d\u092f \u092e\u0947\u0928\u0942',
      gameOver: '\u0916\u0947\u0932 \u0938\u092e\u093e\u092a\u094d\u0924', youWin: '\u0906\u092a \u091c\u0940\u0924 \u0917\u090f!',
      diffBeginner: '\u0936\u0941\u0930\u0941\u0906\u0924\u0940', diffEasy: '\u0906\u0938\u093e\u0928', diffNormal: '\u0938\u093e\u092e\u093e\u0928\u094d\u092f', diffHard: '\u0915\u0920\u093f\u0928',
      raceReady: '\u0924\u0948\u092f\u093e\u0930', raceAgain: '\u092b\u093f\u0930 \u0938\u0947 \u0926\u094c\u0921\u093c', raceMainMenu: '\u092e\u0941\u0916\u094d\u092f \u092e\u0947\u0928\u0942',
      tutClose: '\u0938\u092e\u091d \u0917\u092f\u093e!',
      scoreDisplay: '\u0905\u0902\u0915: {score}', livesDisplay: '\u091c\u0940\u0935\u0928: {n}',
      bestDisplay: '\u0938\u092c\u0938\u0947 \u0905\u091a\u094d\u091b\u093e: {score}', xpDisplay: '\u0915\u0941\u0932 XP: {xp}',
      raceOver: '\u0926\u094c\u0921\u093c \u0938\u092e\u093e\u092a\u094d\u0924',
      selectDifficulty: '\u0915\u0920\u093f\u0928\u093e\u0908 \u091a\u0941\u0928\u0947\u0902', levelCleared: '\u0938\u094d\u0924\u0930 \u092a\u0942\u0930\u093e!'
    }},
    'ur-PK': { name: 'Urdu', nativeName: '\u0627\u0631\u062f\u0648', dir: 'rtl', s: {
      title: 'NEON DODGERS', score: '\u0627\u0633\u06a9\u0648\u0631', lives: '\u062c\u0627\u0646\u06cc\u06ba', best: '\u0628\u06c1\u062a\u0631\u06cc\u0646', keys: '\u0686\u0627\u0628\u06cc\u0627\u06ba',
      howToPlay: '\u06a9\u06cc\u0633\u06d2 \u06a9\u06be\u06cc\u0644\u06cc\u06ba', language: '\u0632\u0628\u0627\u0646',
      retry: '\u062f\u0648\u0628\u0627\u0631\u06c1 \u06a9\u0648\u0634\u0634', mainMenu: '\u0645\u0631\u06a9\u0632\u06cc \u0645\u06cc\u0646\u06cc\u0648', gameOver: '\u06a9\u06be\u06cc\u0644 \u062e\u062a\u0645',
      youWin: '\u0622\u067e \u062c\u06cc\u062a \u06af\u0626\u06d2!',
      diffBeginner: '\u0634\u0631\u0648\u0639\u0627\u062a\u06cc', diffEasy: '\u0622\u0633\u0627\u0646', diffNormal: '\u0645\u0627\u0645\u0648\u0644\u06cc',
      raceReady: '\u062a\u06cc\u0627\u0631', tutClose: '\u0633\u0645\u062c\u06be \u06af\u06cc\u0627!',
      scoreDisplay: '\u0627\u0633\u06a9\u0648\u0631: {score}', livesDisplay: '\u062c\u0627\u0646\u06cc\u06ba: {n}',
      bestDisplay: '\u0628\u06c1\u062a\u0631\u06cc\u0646: {score}'
    }},
    'bn-BD': { name: 'Bengali', nativeName: '\u09ac\u09be\u0982\u09b2\u09be', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u09b8\u09cd\u0995\u09cb\u09b0', lives: '\u099c\u09c0\u09ac\u09a8', best: '\u09b8\u09b0\u09cd\u09ac\u09cb\u09a4\u09cd\u09a4\u09ae', keys: '\u099a\u09be\u09ac\u09bf',
      howToPlay: '\u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u0996\u09c7\u09b2\u09ac\u09c7\u09a8', language: '\u09ad\u09be\u09b7\u09be',
      retry: '\u0986\u09ac\u09be\u09b0 \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8', mainMenu: '\u09aa\u09cd\u09b0\u09a7\u09be\u09a8 \u09ae\u09c7\u09a8\u09c1', gameOver: '\u0996\u09c7\u09b2\u09be \u09b6\u09c7\u09b7',
      youWin: '\u0986\u09aa\u09a8\u09bf \u099c\u09bf\u09a4\u09c7\u099b\u09c7\u09a8!',
      diffBeginner: '\u09a8\u09a4\u09c1\u09a8', diffEasy: '\u09b8\u09b9\u099c', diffNormal: '\u09b8\u09be\u09a7\u09be\u09b0\u09a3',
      raceReady: '\u09aa\u09cd\u09b0\u09b8\u09cd\u09a4\u09c1\u09a4', tutClose: '\u09ac\u09c1\u099d\u09c7\u099b\u09bf!',
      scoreDisplay: '\u09b8\u09cd\u0995\u09cb\u09b0: {score}', livesDisplay: '\u099c\u09c0\u09ac\u09a8: {n}',
      bestDisplay: '\u09b8\u09b0\u09cd\u09ac\u09cb\u09a4\u09cd\u09a4\u09ae: {score}'
    }},
    'pa-IN': { name: 'Punjabi', nativeName: '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0a38\u0a15\u0a4b\u0a30', lives: '\u0a1c\u0a3e\u0a28', best: '\u0a35\u0a71\u0a21\u0a3f\u0a0f \u0a24\u0a4b\u0a02 \u0a35\u0a71\u0a21\u0a3f\u0a0f\u0a06', keys: '\u0a1a\u0a3e\u0a2c\u0a40\u0a06\u0a02',
      howToPlay: '\u0a15\u0a48\u0a38\u0a47 \u0a16\u0a47\u0a21\u0a3f\u0a0f\u0a06', language: '\u0a2d\u0a3e\u0a38\u0a3c\u0a3e',
      retry: '\u0a2e\u0a41\u0a71\u0a15\u0a30 \u0a15\u0a3f\u0a06\u0a02\u0a38\u0a3e \u0a15\u0a30\u0a4b', mainMenu: '\u0a2e\u0a41\u0a71\u0a16 \u0a2e\u0a40\u0a28\u0a42', gameOver: '\u0a16\u0a47\u0a21 \u0a16\u0a71\u0a24\u0a2e',
      youWin: '\u0a24\u0a41\u0a38\u0a40\u0a02 \u0a1c\u0a3f\u0a24 \u0a17\u0a08!', raceReady: '\u0a24\u0a3f\u0a06\u0a30', tutClose: '\u0a38\u0a2e\u0a1d \u0a17\u0a3f\u0a06!',
      scoreDisplay: '\u0a38\u0a15\u0a4b\u0a30: {score}', livesDisplay: '\u0a1c\u0a3e\u0a28: {n}', bestDisplay: '\u0a35\u0a71\u0a21\u0a3f\u0a0f \u0a24\u0a4b\u0a02 \u0a35\u0a71\u0a21\u0a3f\u0a0f\u0a06: {score}'
    }},
    'ta-IN': { name: 'Tamil', nativeName: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc6\u0ba3\u0bcd', lives: '\u0b89\u0baf\u0bbf\u0bb0\u0bcd\u0b95\u0bb3\u0bcd', best: '\u0b9a\u0bbf\u0bb1\u0ba8\u0bcd\u0ba4', keys: '\u0b9a\u0bbe\u0bb5\u0bbf\u0b95\u0bb3\u0bcd',
      howToPlay: '\u0b8e\u0baa\u0bcd\u0baa\u0b9f\u0bbf \u0bb5\u0bbf\u0bb3\u0bc8\u0baf\u0bbe\u0b9f\u0bc1\u0bb5\u0ba4\u0bc1', language: '\u0bae\u0bca\u0bb4\u0bbf',
      retry: '\u0bae\u0bc0\u0ba3\u0bcd\u0b9f\u0bc1\u0bae\u0bcd \u0bae\u0bc1\u0baf\u0bb1\u0bcd\u0b9a\u0bbf', mainMenu: '\u0baa\u0bbf\u0bb0\u0ba4\u0bbe\u0ba9 \u0bae\u0bc6\u0ba9\u0bc2', gameOver: '\u0bb5\u0bbf\u0bb3\u0bc8\u0baf\u0bbe\u0b9f\u0bcd\u0b9f\u0bc1 \u0bae\u0bc1\u0b9f\u0bbf\u0ba8\u0bcd\u0ba4\u0ba4\u0bc1',
      youWin: '\u0ba8\u0bc0\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0bb5\u0bc6\u0ba9\u0bcd\u0bb1\u0bc0\u0bb0\u0bcd\u0b95\u0bb3\u0bcd!', raceReady: '\u0ba4\u0baf\u0bbe\u0bb0\u0bcd', tutClose: '\u0baa\u0bc1\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0ba4\u0bc1!',
      scoreDisplay: '\u0bae\u0ba4\u0bbf\u0baa\u0bcd\u0baa\u0bc6\u0ba3\u0bcd: {score}', livesDisplay: '\u0b89\u0baf\u0bbf\u0bb0\u0bcd\u0b95\u0bb3\u0bcd: {n}', bestDisplay: '\u0b9a\u0bbf\u0bb1\u0ba8\u0bcd\u0ba4: {score}'
    }},
    'te-IN': { name: 'Telugu', nativeName: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0c38\u0c4d\u0c15\u0c4b\u0c30\u0c4d', lives: '\u0c2a\u0c4d\u0c30\u0c3e\u0c23\u0c3e\u0c32\u0c41', best: '\u0c09\u0c24\u0c4d\u0c24\u0c2e\u0c2e\u0c48\u0c28', keys: '\u0c2a\u0c4d\u0c30\u0c27\u0c3e\u0c28\u0c3e\u0c32\u0c41',
      howToPlay: '\u0c0e\u0c32\u0c3e \u0c06\u0c21\u0c3e\u0c32\u0c4b', language: '\u0c2d\u0c3e\u0c37',
      retry: '\u0c2e\u0c30\u0c32\u0c40 \u0c2a\u0c4d\u0c30\u0c2f\u0c24\u0c4d\u0c28\u0c3f\u0c02\u0c1a\u0c41', mainMenu: '\u0c2a\u0c4d\u0c30\u0c27\u0c3e\u0c28 \u0c2e\u0c46\u0c28\u0c42', gameOver: '\u0c06\u0c1f \u0c2e\u0c41\u0c17\u0c3f\u0c02\u0c26\u0c3f',
      youWin: '\u0c2e\u0c40\u0c30\u0c41 \u0c17\u0c46\u0c32\u0c41\u0c1a\u0c3e\u0c30\u0c41!', raceReady: '\u0c38\u0c3f\u0c26\u0c4d\u0c27\u0c02', tutClose: '\u0c05\u0c30\u0c4d\u0c25\u0c02 \u0c05\u0c2f\u0c3f\u0c02\u0c26\u0c3f!',
      scoreDisplay: '\u0c38\u0c4d\u0c15\u0c4b\u0c30\u0c4d: {score}', livesDisplay: '\u0c2a\u0c4d\u0c30\u0c3e\u0c23\u0c3e\u0c32\u0c41: {n}', bestDisplay: '\u0c09\u0c24\u0c4d\u0c24\u0c2e\u0c2e\u0c48\u0c28: {score}'
    }},
    'mr-IN': { name: 'Marathi', nativeName: '\u092e\u0930\u093e\u0920\u0940', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0917\u0941\u0923', lives: '\u091c\u0940\u0935\u0928', best: '\u0938\u0930\u094d\u0935\u094b\u0924\u094d\u0924\u092e', keys: '\u091a\u093e\u0935\u094d\u092f\u093e',
      howToPlay: '\u0915\u0938\u0947 \u0916\u0947\u0933\u093e\u0935\u0947', language: '\u092d\u093e\u0937\u093e',
      retry: '\u092a\u0941\u0928\u094d\u0939\u093e \u092a\u094d\u0930\u092f\u0924\u094d\u0928 \u0915\u0930\u093e', mainMenu: '\u092e\u0941\u0916\u094d\u092f \u092e\u0947\u0928\u0942', gameOver: '\u0916\u0947\u0933 \u0938\u0902\u092a\u0932\u093e',
      youWin: '\u0924\u0942 \u091c\u093f\u0902\u0915\u0932\u093e\u0938!', raceReady: '\u0924\u092f\u093e\u0930', tutClose: '\u0938\u092e\u091c\u0932\u0902!',
      scoreDisplay: '\u0917\u0941\u0923: {score}', livesDisplay: '\u091c\u0940\u0935\u0928: {n}', bestDisplay: '\u0938\u0930\u094d\u0935\u094b\u0924\u094d\u0924\u092e: {score}'
    }},
    'gu-IN': { name: 'Gujarati', nativeName: '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0ab8\u0acd\u0a95\u0acb\u0ab0', lives: '\u0a9c\u0ac0\u0ab5\u0aa8', best: '\u0ab6\u0acd\u0ab0\u0ac7\u0ab7\u0acd\u0aa0', keys: '\u0a9a\u0abe\u0ab5\u0ac0\u0a93',
      howToPlay: '\u0a95\u0ac7\u0aae \u0ab0\u0ac0\u0aa4\u0ac7 \u0ab0\u0aae\u0ab5\u0ac1\u0a82', language: '\u0aad\u0abe\u0ab7\u0abe',
      retry: '\u0aab\u0ab0\u0ac0 \u0aaa\u0acd\u0ab0\u0aaf\u0aa4\u0acd\u0aa8 \u0a95\u0ab0\u0acb', mainMenu: '\u0aae\u0ac1\u0a96\u0acd\u0aaf \u0aae\u0ac7\u0aa8\u0ac2', gameOver: '\u0ab0\u0aae\u0aa4 \u0aaa\u0ac2\u0ab0\u0acd\u0aa3',
      youWin: '\u0aa4\u0aae\u0ac7 \u0a9c\u0ac0\u0aa4\u0acd\u0aaf\u0abe!', raceReady: '\u0aa4\u0ac8\u0aaf\u0abe\u0ab0', tutClose: '\u0ab8\u0aae\u0a9c\u0acd\u0aaf\u0ac2\u0a82!',
      scoreDisplay: '\u0ab8\u0acd\u0a95\u0acb\u0ab0: {score}', livesDisplay: '\u0a9c\u0ac0\u0ab5\u0aa8: {n}', bestDisplay: '\u0ab6\u0acd\u0ab0\u0ac7\u0ab7\u0acd\u0aa0: {score}'
    }},
    'kn-IN': { name: 'Kannada', nativeName: '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0c85\u0c82\u0c95', lives: '\u0c9c\u0cc0\u0cb5\u0ca8\u0c97\u0cb3\u0cc1', best: '\u0c85\u0ca4\u0ccd\u0caf\u0cc1\u0ca4\u0ccd\u0ca4\u0cae', keys: '\u0c95\u0cc0\u0cb2\u0cbf\u0c97\u0cb3\u0cc1',
      howToPlay: '\u0c86\u0ca1\u0cc1\u0cb5\u0cc1\u0ca6\u0cc1 \u0cb9\u0cc7\u0c97\u0cc6', language: '\u0cad\u0cbe\u0cb7\u0cc6',
      retry: '\u0cae\u0ca4\u0ccd\u0ca4\u0cca\u0cae\u0ccd\u0cae\u0cc7 \u0caa\u0ccd\u0cb0\u0caf\u0ca4\u0ccd\u0ca8\u0cbf\u0cb8\u0cbf', mainMenu: '\u0cae\u0cc1\u0c96\u0ccd\u0caf \u0cae\u0cc6\u0ca8\u0cc1', gameOver: '\u0c86\u0c9f \u0cae\u0cc1\u0c97\u0cbf\u0caf\u0cbf\u0ca4\u0cc1',
      youWin: '\u0ca8\u0cc0\u0cb5\u0cc1 \u0c97\u0cc6\u0cb2\u0ccd\u0cb2\u0cbf\u0ca6\u0cbf\u0cb0\u0cbf!', raceReady: '\u0cb8\u0cbf\u0ca6\u0ccd\u0ca7', tutClose: '\u0c85\u0cb0\u0ccd\u0ca5 \u0c86\u0caf\u0cbf\u0ca4\u0cc1!',
      scoreDisplay: '\u0c85\u0c82\u0c95: {score}', livesDisplay: '\u0c9c\u0cc0\u0cb5\u0ca8\u0c97\u0cb3\u0cc1: {n}', bestDisplay: '\u0c85\u0ca4\u0ccd\u0caf\u0cc1\u0ca4\u0ccd\u0ca4\u0cae: {score}'
    }},
    'ml-IN': { name: 'Malayalam', nativeName: '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0d38\u0d4d\u0d15\u0d4b\u0d7c', lives: '\u0d1c\u0d40\u0d35\u0d28\u0d19\u0d4d\u0d19\u0d7e', best: '\u0d2e\u0d3f\u0d15\u0d1a\u0d4d\u0d1a', keys: '\u0d24\u0d3e\u0d15\u0d4d\u0d15\u0d4b\u0d7e',
      howToPlay: '\u0d0e\u0d19\u0d4d\u0d19\u0d28\u0d46 \u0d15\u0d33\u0d3f\u0d15\u0d4d\u0d15\u0d3e\u0d02', language: '\u0d2d\u0d3e\u0d37',
      retry: '\u0d35\u0d40\u0d23\u0d4d\u0d1f\u0d41\u0d02 \u0d36\u0d4d\u0d30\u0d2e\u0d3f\u0d15\u0d4d\u0d15\u0d41\u0d15', mainMenu: '\u0d2a\u0d4d\u0d30\u0d27\u0d3e\u0d28 \u0d2e\u0d46\u0d28\u0d42', gameOver: '\u0d15\u0d33\u0d3f \u0d05\u0d35\u0d38\u0d3e\u0d28\u0d3f\u0d1a\u0d4d\u0d1a\u0d41',
      youWin: '\u0d28\u0d40\u0d02 \u0d35\u0d3f\u0d1c\u0d2f\u0d3f\u0d1a\u0d4d\u0d1a\u0d41!', raceReady: '\u0d24\u0d2f\u0d3e\u0d30\u0d4d', tutClose: '\u0d2e\u0d28\u0d38\u0d4d\u0d38\u0d3f\u0d32\u0d3e\u0d2f\u0d3f!',
      scoreDisplay: '\u0d38\u0d4d\u0d15\u0d4b\u0d7c: {score}', livesDisplay: '\u0d1c\u0d40\u0d35\u0d28\u0d19\u0d4d\u0d19\u0d7e: {n}', bestDisplay: '\u0d2e\u0d3f\u0d15\u0d1a\u0d4d\u0d1a: {score}'
    }},
    'my-MM': { name: 'Burmese', nativeName: '\u1019\u103c\u1014\u103a\u1019\u102c', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u1021\u101b\u1031\u102c\u1004\u103a', lives: '\u1021\u102c\u1019\u1039\u1019\u102c', best: '\u1021\u1011\u102d\u1019\u103a\u101c\u1031\u102c\u1004\u103a', keys: '\u101e\u1030\u1010\u103d\u1031',
      howToPlay: '\u1018\u1031\u102c\u1019\u103a \u1000\u102c\u1018\u1030\u101b\u103e\u102c', language: '\u1018\u102c\u101e\u102c',
      retry: '\u1011\u102c\u101e\u102c\u1000\u103c\u1031\u1019\u103e\u102c', mainMenu: '\u1019\u103e\u102d\u1000\u103a\u1019\u1031\u1014\u103a\u1012\u1030', gameOver: '\u1000\u1019\u103a\u1038\u1021\u1014\u1039\u1014\u1031\u101a\u103a\u1015\u103c\u102e\u1038',
      tutClose: '\u1014\u1031\u1000\u1039\u1000\u1010\u1032!',
      scoreDisplay: '\u1021\u101b\u1031\u102c\u1004\u103a: {score}', livesDisplay: '\u1021\u102c\u1019\u1039\u1019\u102c: {n}', bestDisplay: '\u1021\u1011\u102d\u1019\u103a\u101c\u1031\u102c\u1004\u103a: {score}'
    }},
    'th-TH': { name: 'Thai', nativeName: '\u0e44\u0e17\u0e22', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0e04\u0e30\u0e41\u0e19\u0e19', lives: '\u0e0a\u0e35\u0e27\u0e34\u0e15', best: '\u0e14\u0e35\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14', keys: '\u0e01\u0e38\u0e0d\u0e41\u0e08',
      howToPlay: '\u0e27\u0e34\u0e18\u0e35\u0e40\u0e25\u0e48\u0e19', language: '\u0e20\u0e32\u0e29\u0e32',
      retry: '\u0e25\u0e2d\u0e07\u0e43\u0e2b\u0e21\u0e48', mainMenu: '\u0e40\u0e21\u0e19\u0e39\u0e2b\u0e25\u0e31\u0e01', gameOver: '\u0e08\u0e1a\u0e40\u0e01\u0e21',
      youWin: '\u0e04\u0e38\u0e13\u0e0a\u0e19\u0e30!',
      diffBeginner: '\u0e21\u0e37\u0e48\u0e2d\u0e43\u0e2b\u0e21\u0e48', diffEasy: '\u0e07\u0e48\u0e32\u0e22', diffNormal: '\u0e1b\u0e01\u0e15\u0e34', diffHard: '\u0e22\u0e32\u0e01',
      raceReady: '\u0e1e\u0e23\u0e49\u0e2d\u0e21', tutClose: '\u0e40\u0e02\u0e49\u0e32\u0e43\u0e08!',
      scoreDisplay: '\u0e04\u0e30\u0e41\u0e19\u0e19: {score}', livesDisplay: '\u0e0a\u0e35\u0e27\u0e34\u0e15: {n}', bestDisplay: '\u0e14\u0e35\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14: {score}'
    }},
    'lo-LA': { name: 'Lao', nativeName: '\u0ea5\u0eb2\u0ea7', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0e84\u0eb0\u0ec1\u0e99\u0e99', lives: '\u0e8a\u0eb5\u0ea7\u0eb4\u0e95', best: '\u0e97\u0eb5\u0ec8\u0e94\u0eb5\u0e97\u0eb5\u0ec8\u0eaa\u0eb8\u0e94', keys: '\u0e81\u0eb8\u0e8d\u0ec1\u0e88',
      howToPlay: '\u0ea7\u0eb4\u0e98\u0eb5\u0edd\u0ec9\u0e99', language: '\u0e9e\u0eb2\u0eaa\u0eb2',
      retry: '\u0ea5\u0ead\u0e87\u0ec3\u0edd\u0ec8\u0ea1\u0ec8', mainMenu: '\u0ec0\u0ea1\u0e99\u0eb9\u0edd\u0eb1\u0e81', gameOver: '\u0e88\u0e9a\u0ec0\u0e81\u0eb2\u0ea1',
      tutClose: '\u0ec0\u0e82\u0ebb\u0ec9\u0eb2\u0ec3\u0e88!',
      scoreDisplay: '\u0e84\u0eb0\u0ec1\u0e99\u0e99: {score}', livesDisplay: '\u0e8a\u0eb5\u0ea7\u0eb4\u0e95: {n}', bestDisplay: '\u0e97\u0eb5\u0ec8\u0e94\u0eb5\u0e97\u0eb5\u0ec8\u0eaa\u0eb8\u0e94: {score}'
    }},
    'km-KH': { name: 'Khmer', nativeName: '\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u1796\u17b6\u1793\u17cb', lives: '\u1787\u17b6\u1791\u17b7\u1796\u17d2\u179a\u17bc\u1799\u17cb', best: '\u179b\u1793\u17d2\u1782\u17c3\u1797\u17b6\u1793\u17cb', keys: '\u1782\u17c8\u1793\u17d2\u178e\u17b6\u1781\u17cb',
      howToPlay: '\u179c\u17b7\u1792\u17b8\u1794\u17cb\u179b\u1780\u17d2\u179c\u17a0\u1780\u17b6\u179a', language: '\u1797\u17b6\u179f\u17b6',
      retry: '\u1796\u179a\u17cb\u1798\u17d2\u1793\u17c7\u179c\u17c1\u1791\u17b9\u1798', mainMenu: '\u1798\u17c3\u1793\u17d2\u1799\u17bc', gameOver: '\u1794\u17d2\u179a\u17b7\u1798\u17d2\u179f\u17a8\u1780\u17b6\u179a\u1780\u17d2\u1793\u17be\u1784\u17cb',
      tutClose: '\u1799\u17d0\u179a\u178b\u17be\u1789\u1793\u17d0\u1780\u17cb!',
      scoreDisplay: '\u1796\u17b6\u1793\u17cb: {score}', livesDisplay: '\u1787\u17b6\u1791\u17b7: {n}', bestDisplay: '\u179b\u1793\u17d2\u1782\u17c3: {score}'
    }},
    'vi-VN': { name: 'Vietnamese', nativeName: 'Ti\u1ebfng Vi\u1ec7t', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0110i\u1ec3m', lives: 'M\u1ea1ng', best: 'Cao nh\u1ea5t', keys: 'Ch\u00eca kh\u00f3a',
      totalXp: 'T\u1ed5ng XP', howToPlay: 'C\u00e1ch ch\u01a1i', language: 'Ng\u00f4n ng\u1eef',
      retry: 'TH\u1eec L\u1ea0I', mainMenu: 'MENU CH\u00cdNH', gameOver: 'K\u1ebeT TH\u00daC',
      youWin: 'B\u1ea0N TH\u1eaeNG!', raceOver: 'CU\u1ed8C \u0110UA K\u1ebeT TH\u00daC',
      diffBeginner: 'Ng\u01b0\u1eddi m\u1edbi', diffEasy: 'D\u1ec5', diffNormal: 'Th\u01b0\u1eddng', diffHard: 'Kh\u00f3',
      diffExpert: 'Chuy\u00ean gia', diffMaster: 'B\u1eadc th\u1ea7y',
      raceReady: 'S\u1eb5n s\u00e0ng', raceAgain: '\u0110ua l\u1ea1i', raceMainMenu: 'Menu ch\u00ednh',
      tutClose: '\u0110\u00e3 hi\u1ec3u!',
      scoreDisplay: '\u0110i\u1ec3m: {score}', livesDisplay: 'M\u1ea1ng: {n}',
      bestDisplay: 'Cao nh\u1ea5t: {score}', xpDisplay: 'T\u1ed5ng XP: {xp}',
      keysDisplay: 'Ch\u00eca kh\u00f3a: {n}', selectDifficulty: 'Ch\u1ecdn \u0111\u1ed9 kh\u00f3',
      levelCleared: 'V\u01b0\u1ee3t m\u1ee9c!', wins: '{name} TH\u1eaeNG!',
      raceCreateRoom: 'T\u1ea1o ph\u00f2ng', raceJoinRoom: 'V\u00e0o ph\u00f2ng', raceBack: 'Quay l\u1ea1i',
      raceLobby: 'S\u1ea3nh ch\u1edd', raceStandings: 'B\u1ea3ng x\u1ebfp h\u1ea1ng', raceEliminated: 'B\u1eca LO\u1ea0I!'
    }},
    'id-ID': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Skor', lives: 'Nyawa', best: 'Terbaik', keys: 'Kunci',
      totalXp: 'Total XP', howToPlay: 'Cara bermain', language: 'Bahasa',
      retry: 'COBA LAGI', mainMenu: 'MENU UTAMA', gameOver: 'PERMAINAN BERAKHIR',
      youWin: 'KAMU MENANG!', raceOver: 'PERLOMBAAN BERAKHIR',
      diffBeginner: 'Pemula', diffEasy: 'Mudah', diffNormal: 'Normal', diffHard: 'Sulit',
      diffExpert: 'Ahli', diffMaster: 'Master',
      raceReady: 'Siap', raceAgain: 'Lomba lagi', raceMainMenu: 'Menu utama',
      tutClose: 'Mengerti!',
      scoreDisplay: 'Skor: {score}', livesDisplay: 'Nyawa: {n}',
      bestDisplay: 'Terbaik: {score}', xpDisplay: 'Total XP: {xp}',
      keysDisplay: 'Kunci: {n}', selectDifficulty: 'Pilih kesulitan',
      raceCreateRoom: 'Buat ruangan', raceJoinRoom: 'Gabung ruangan', raceBack: 'Kembali',
      raceStandings: 'Klasemen', raceEliminated: 'TERELIMINASI!'
    }},
    'ms-MY': { name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Skor', lives: 'Nyawa', best: 'Terbaik', keys: 'Kunci',
      howToPlay: 'Cara bermain', language: 'Bahasa',
      retry: 'CUBA LAGI', mainMenu: 'MENU UTAMA', gameOver: 'PERMAINAN TAMAT',
      youWin: 'ANDA MENANG!', diffBeginner: 'Permulaan', diffEasy: 'Mudah', diffNormal: 'Normal', diffHard: 'Sukar',
      raceReady: 'Sedia', tutClose: 'Faham!',
      scoreDisplay: 'Skor: {score}', livesDisplay: 'Nyawa: {n}', bestDisplay: 'Terbaik: {score}'
    }},
    'tl-PH': { name: 'Tagalog', nativeName: 'Tagalog', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntos', lives: 'Buhay', best: 'Pinakamahusay', keys: 'Susi',
      howToPlay: 'Paano maglaro', language: 'Wika',
      retry: 'SUBUKAN MULI', mainMenu: 'PANGUNAHING MENU', gameOver: 'TAPOS NA ANG LARO',
      youWin: 'IKAW AY NANALO!', diffBeginner: 'Baguhan', diffEasy: 'Madali', diffNormal: 'Normal',
      raceReady: 'Handa', tutClose: 'Naunawaan!',
      scoreDisplay: 'Puntos: {score}', livesDisplay: 'Buhay: {n}', bestDisplay: 'Pinakamahusay: {score}'
    }},
    'sw-KE': { name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Alama', lives: 'Maisha', best: 'Bora', keys: 'Funguo',
      howToPlay: 'Jinsi ya kucheza', language: 'Lugha',
      retry: 'JARIBU TENA', mainMenu: 'MENU KUU', gameOver: 'MWISHO WA MCHEZO',
      youWin: 'UMESHINDI!', diffBeginner: 'Anayeanza', diffEasy: 'Rahisi', diffNormal: 'Kawaida',
      raceReady: 'Tayari', tutClose: 'Nimeelewa!',
      scoreDisplay: 'Alama: {score}', livesDisplay: 'Maisha: {n}', bestDisplay: 'Bora: {score}'
    }},
    'zu-ZA': { name: 'Zulu', nativeName: 'isiZulu', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Amaphuzu', lives: 'Ukuphila', best: 'Okuhle Kakhulu', keys: 'Okhiye',
      howToPlay: 'Indlela yokudlala', language: 'Ulimi',
      retry: 'ZAMA FUTHI', mainMenu: 'IMENYU YOKUQALA', gameOver: 'UMPHELO WOMDLALO',
      youWin: 'UWINILE!', raceReady: 'Sekulungele', tutClose: 'Ngiyezwa!',
      scoreDisplay: 'Amaphuzu: {score}', livesDisplay: 'Ukuphila: {n}', bestDisplay: 'Okuhle Kakhulu: {score}'
    }},
    'af-ZA': { name: 'Afrikaans', nativeName: 'Afrikaans', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punte', lives: 'Lewens', best: 'Beste', keys: 'Sleutels',
      howToPlay: 'Hoe om te speel', language: 'Taal',
      retry: 'PROBEER WEER', mainMenu: 'HOOFMENU', gameOver: 'SPEL VERBY',
      youWin: 'JY WEN!', diffBeginner: 'Beginner', diffEasy: 'Maklik', diffNormal: 'Normaal',
      raceReady: 'Gereed', tutClose: 'Ek verstaan!',
      scoreDisplay: 'Punte: {score}', livesDisplay: 'Lewens: {n}', bestDisplay: 'Beste: {score}'
    }},
    'ha-NG': { name: 'Hausa', nativeName: 'Hausa', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Maki', lives: 'Rayuwa', best: 'Mafi Kyau', keys: 'Makullai',
      howToPlay: 'Yadda ake wasa', language: 'Harshe',
      retry: 'SAKE GWADAYI', mainMenu: 'BABAR MENU', gameOver: 'WASAN YA KARE',
      youWin: 'KA YI NASARA!', raceReady: 'A Shirye', tutClose: 'Na Fahimta!',
      scoreDisplay: 'Maki: {score}', livesDisplay: 'Rayuwa: {n}', bestDisplay: 'Mafi Kyau: {score}'
    }},
    'yo-NG': { name: 'Yoruba', nativeName: 'Yor\u00f9b\u00e1', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Ojuami', lives: 'Aye', best: 'Didarajulo', keys: 'Kokoro',
      howToPlay: 'Bii o se ndun', language: 'Ede',
      retry: 'TUN GBIYANJU', mainMenu: 'AKOJ\u00c1 MENU', gameOver: 'ERE TI PARI',
      youWin: 'O SE BORI!', raceReady: 'Mura', tutClose: 'O Ye Mi!',
      scoreDisplay: 'Ojuami: {score}', livesDisplay: 'Aye: {n}', bestDisplay: 'Didarajulo: {score}'
    }},
    'ig-NG': { name: 'Igbo', nativeName: 'Igbo', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Akara', lives: 'Ndu', best: 'Kacha Mma', keys: 'Igodo',
      howToPlay: 'Etu esi egwu', language: 'Asusu',
      retry: 'GBALIA OZO', mainMenu: 'MENU ISHI', gameOver: 'EGWU AGWUOLA',
      youWin: 'I MERELA!', raceReady: 'Di Njikere', tutClose: 'Aghotala!',
      scoreDisplay: 'Akara: {score}', livesDisplay: 'Ndu: {n}', bestDisplay: 'Kacha Mma: {score}'
    }},
    'am-ET': { name: 'Amharic', nativeName: '\u12a0\u121b\u122d\u129b', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u12a0\u1235\u120b\u121d', lives: '\u1208\u12cd\u1275', best: '\u1218\u1228\u1260\u1229', keys: '\u12c8\u122d\u1275\u1361\u12ce\u127d',
      howToPlay: '\u12a5\u1295\u12f5 \u121a\u1335\u1325\u1275\u12ed', language: '\u1265\u120d\u1233\u1295',
      retry: '\u12f0\u121d\u12ed \u1233\u12ed \u121e\u12ed\u12f0', mainMenu: '\u12e8\u1213\u1265 \u121c\u1295\u10cd', gameOver: '\u130a\u12da \u12a0\u120d\u1298\u1235\u1240\u120d',
      tutClose: '\u1300\u1205\u1293!',
      scoreDisplay: '\u12a0\u1235\u120b\u121d: {score}', livesDisplay: '\u1208\u12cd\u1275: {n}', bestDisplay: '\u1218\u1228\u1260\u1229: {score}'
    }},
    'so-SO': { name: 'Somali', nativeName: 'Soomaali', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Dhibcaha', lives: 'Nolosha', best: 'Ugu Fiican', keys: 'Furaha',
      howToPlay: 'Sida loo ciyaaro', language: 'Luuqad',
      retry: 'ISKU DAY MAR KALE', mainMenu: 'MENYUGA GURTIMEDA', gameOver: 'CIYAARTU WAA DHAMATAY',
      youWin: 'WAA GUULAYSTE!', raceReady: 'Diyaar', tutClose: 'Waan Fahmay!',
      scoreDisplay: 'Dhibcaha: {score}', livesDisplay: 'Nolosha: {n}', bestDisplay: 'Ugu Fiican: {score}'
    }},
    'ne-NP': { name: 'Nepali', nativeName: '\u0928\u0947\u092a\u093e\u0932\u0940', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0905\u0902\u0915', lives: '\u091c\u0940\u0935\u0928', best: '\u0909\u0924\u094d\u0924\u092e', keys: '\u0915\u0941\u091e\u094d\u091a\u0940\u0939\u0930\u0942',
      howToPlay: '\u0915\u0938\u094d\u0930\u0940 \u0916\u0947\u0932\u094d\u0928\u0947', language: '\u092d\u093e\u0937\u093e',
      retry: '\u092a\u0941\u0928\u093f\u092e\u0941\u0926\u094d\u092d\u092f \u092a\u094d\u0930\u092f\u093e\u0938', mainMenu: '\u092e\u0941\u0916\u094d\u092f \u092e\u0947\u0928\u0941', gameOver: '\u0916\u0947\u0932 \u0938\u0915\u093f\u092f\u094b',
      youWin: '\u0924\u092a\u093e\u0908\u0902 \u091c\u093f\u0924\u094d\u0928\u0941\u092d\u092f\u094b!', raceReady: '\u0924\u092f\u093e\u0930', tutClose: '\u092c\u0941\u091d\u093f\u090f\u0901!',
      scoreDisplay: '\u0905\u0902\u0915: {score}', livesDisplay: '\u091c\u0940\u0935\u0928: {n}', bestDisplay: '\u0909\u0924\u094d\u0924\u092e: {score}'
    }},
    'si-LK': { name: 'Sinhala', nativeName: '\u0dc3\u0dd2\u0d82\u0dc4\u0dbd', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0dbd\u0d9a\u0dd4\u0dab\u0dd4', lives: '\u0da2\u0dd3\u0dc0\u0dd2\u0dad', best: '\u0dc4\u0ddc\u0db3\u0db8', keys: '\u0dba\u0dad\u0dd4\u0dbb\u0dd4',
      howToPlay: '\u0d9a\u0dca\u200d\u0dbb\u0dd3\u0da9\u0dcf \u0d9a\u0dbb\u0db1 \u0d86\u0d9a\u0dcf\u0dbb\u0dba', language: '\u0db7\u0dcf\u0dc2\u0dcf\u0dc0',
      retry: '\u0db1\u0dd0\u0dc0\u0dad \u0d8b\u0dad\u0dca\u0dc3\u0dc4\u0db1\u0dca \u0d9a\u0dbb\u0db1\u0dca\u0db1', mainMenu: '\u0db4\u0dca\u200d\u0dbb\u0db0\u0dcf\u0db1 \u0db8\u0dd9\u0db1\u0dd4\u0dc0', gameOver: '\u0d9a\u0dca\u200d\u0dbb\u0dd3\u0da9\u0dcf\u0dc0 \u0d85\u0dc0\u0dc3\u0db1\u0dca',
      tutClose: '\u0dad\u0dda\u0dbb\u0dd4\u0dab\u0dcf!',
      scoreDisplay: '\u0dbd\u0d9a\u0dd4\u0dab\u0dd4: {score}', livesDisplay: '\u0da2\u0dd3\u0dc0\u0dd2\u0dad: {n}', bestDisplay: '\u0dc4\u0ddc\u0db3\u0db8: {score}'
    }},
    'mn-MN': { name: 'Mongolian', nativeName: '\u041c\u043e\u043d\u0433\u043e\u043b', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u041e\u043d\u043e\u043e', lives: '\u0410\u043c\u044c\u0434', best: '\u0428\u0438\u043b\u0434\u044d\u044d\u0440', keys: '\u0422\u04af\u043b\u0445\u04af\u04af\u0440',
      howToPlay: 'X\u044d\u0440\u0445\u044d\u043d \u0442\u043e\u043e\u043b\u043e\u0445', language: '\u0425\u044d\u043b',
      retry: '\u0414\u0430\u0445\u0438\u043d \u043e\u0440\u043e\u043b\u0434\u043e\u0445', mainMenu: '\u0492\u041e\u041b \u041c\u0415\u041d\u042e', gameOver: '\u0422\u041e\u0413\u041b\u041e\u041e\u041c \u0414\u0423\u0423\u0421\u0421\u0410\u041d',
      tutClose: '\u041e\u0439\u043b\u0433\u043e\u043e!',
      scoreDisplay: '\u041e\u043d\u043e\u043e: {score}', livesDisplay: '\u0410\u043c\u044c\u0434: {n}', bestDisplay: '\u0428\u0438\u043b\u0434\u044d\u044d\u0440: {score}'
    }},
    'ka-GE': { name: 'Georgian', nativeName: '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u10e5\u10e3\u10da\u10d8', lives: '\u10e1\u10d8\u10ea\u10dd\u10ea\u10ee\u10d4', best: '\u10e1\u10d0\u10e3\u10d9\u10d4\u10d7\u10d4\u10e1\u10dd', keys: '\u10d2\u10d0\u10e1\u10d0\u10e6\u10d4\u10d1\u10d8',
      howToPlay: '\u10e0\u10dd\u10d2\u10dd\u10e0 \u10d5\u10d7\u10d0\u10db\u10d0\u10e8\u10dd\u10d7', language: '\u10d4\u10dc\u10d0',
      retry: '\u10ee\u10d4\u10da\u10d0\u10ee\u10d0\u10da \u10ea\u10d0\u10d3\u10d0', mainMenu: '\u10db\u10d7\u10d0\u10d5\u10d0\u10e0\u10d8 \u10db\u10d4\u10dc\u10d8\u10e3', gameOver: '\u10d7\u10d0\u10db\u10d0\u10e8\u10d8 \u10d3\u10d0\u10e1\u10e0\u10e3\u10da\u10d3\u10d0',
      tutClose: '\u10d2\u10d0\u10d5\u10d8\u10d2\u10d4!',
      scoreDisplay: '\u10e5\u10e3\u10da\u10d8: {score}', livesDisplay: '\u10e1\u10d8\u10ea\u10dd\u10ea\u10ee\u10d4: {n}', bestDisplay: '\u10e1\u10d0\u10e3\u10d9\u10d4\u10d7\u10d4\u10e1\u10dd: {score}'
    }},
    'kk-KZ': { name: 'Kazakh', nativeName: '\u049a\u0430\u0437\u0430\u049b', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u04b0\u043f\u0430\u0439', lives: '\u04e8\u043c\u0456\u0440', best: '\u04d8\u0439\u0433\u0456', keys: '\u041a\u0456\u043b\u0442\u0442\u0435\u0440',
      howToPlay: '\u049a\u0430\u043b\u0430\u0439 \u043e\u0439\u043d\u0430\u0443', language: '\u0422\u0456\u043b',
      retry: '\u049a\u0410\u0419\u0422\u0410\u0414\u0410\u041d \u041a\u04e8\u0420\u0406', mainMenu: '\u0411\u0410\u0421\u0422\u042b \u041c\u0415\u041d\u042e', gameOver: '\u041e\u0419\u042b\u041d \u0411\u0406\u0422\u0422\u0406',
      tutClose: '\u0422\u04af\u0441\u0456\u043d\u0434\u0456\u043c!',
      scoreDisplay: '\u04b0\u043f\u0430\u0439: {score}', livesDisplay: '\u04e8\u043c\u0456\u0440: {n}', bestDisplay: '\u04d8\u0439\u0433\u0456: {score}'
    }},
    'uz-UZ': { name: 'Uzbek', nativeName: "O'zbek", dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Ball', lives: 'Hayot', best: 'Eng yaxshi', keys: 'Kalitlar',
      howToPlay: "Qanday o'ynash", language: 'Til',
      retry: 'QAYTA URINISH', mainMenu: 'ASOSIY MENU', gameOver: "O'YIN TUGADI",
      tutClose: "Tushundim!",
      scoreDisplay: "Ball: {score}", livesDisplay: "Hayot: {n}", bestDisplay: "Eng yaxshi: {score}"
    }},
    'fi-FI': { name: 'Finnish', nativeName: 'Suomi', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Pisteet', lives: 'El\u00e4m\u00e4t', best: 'Paras', keys: 'Avaimet',
      howToPlay: 'Kuinka pelata', language: 'Kieli',
      retry: 'YRIT\u00c4 UUDELLEEN', mainMenu: 'P\u00c4\u00c4VALIKKO', gameOver: 'PELI OHI',
      youWin: 'VOITIT!', raceReady: 'Valmis', tutClose: 'Selv\u00e4!',
      scoreDisplay: 'Pisteet: {score}', livesDisplay: 'El\u00e4m\u00e4t: {n}', bestDisplay: 'Paras: {score}'
    }},
    'sv-SE': { name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Po\u00e4ng', lives: 'Liv', best: 'B\u00e4sta', keys: 'Nycklar',
      howToPlay: 'Hur man spelar', language: 'Spr\u00e5k',
      retry: 'F\u00d6RS\u00d6K IGEN', mainMenu: 'HUVUDMENY', gameOver: 'SPELET SLUT',
      youWin: 'DU VINNER!', raceReady: 'Redo', tutClose: 'Jag fattar!',
      scoreDisplay: 'Po\u00e4ng: {score}', livesDisplay: 'Liv: {n}', bestDisplay: 'B\u00e4sta: {score}'
    }},
    'nb-NO': { name: 'Norwegian (Bokm\u00e5l)', nativeName: 'Norsk Bokm\u00e5l', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Poeng', lives: 'Liv', best: 'Beste', keys: 'N\u00f8kler',
      howToPlay: 'Hvordan spille', language: 'Spr\u00e5k',
      retry: 'PR\u00d8V IGJEN', mainMenu: 'HOVEDMENY', gameOver: 'SPILLET SLUTT',
      youWin: 'DU VINNER!', raceReady: 'Klar', tutClose: 'Skj\u00f8nner!',
      scoreDisplay: 'Poeng: {score}', livesDisplay: 'Liv: {n}', bestDisplay: 'Beste: {score}'
    }},
    'da-DK': { name: 'Danish', nativeName: 'Dansk', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Point', lives: 'Liv', best: 'Bedste', keys: 'N\u00f8gler',
      howToPlay: 'S\u00e5dan spiller du', language: 'Sprog',
      retry: 'PR\u00d8V IGEN', mainMenu: 'HOVEDMENU', gameOver: 'SPIL SLUT',
      youWin: 'DU VINDER!', raceReady: 'Klar', tutClose: 'Forst\u00e5et!',
      scoreDisplay: 'Point: {score}', livesDisplay: 'Liv: {n}', bestDisplay: 'Bedste: {score}'
    }},
    'pl-PL': { name: 'Polish', nativeName: 'Polski', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punkty', lives: '\u017bycia', best: 'Najlepszy', keys: 'Klucze',
      totalXp: 'Suma XP', howToPlay: 'Jak gra\u0107', language: 'J\u0119zyk',
      retry: 'SPR\u00d3BUJ PONOWNIE', mainMenu: 'MENU G\u0141\u00d3WNE', gameOver: 'KONIEC GRY',
      youWin: 'WYGRA\u0141E\u015a!', raceOver: 'WY\u015aCIG ZAKO\u0143CZONY',
      diffBeginner: 'Pocz\u0105tkuj\u0105cy', diffEasy: '\u0141atwy', diffNormal: 'Normalny', diffHard: 'Trudny',
      diffExpert: 'Ekspert', diffMaster: 'Mistrz',
      raceReady: 'Gotowy', raceAgain: 'Jeszcze raz', raceMainMenu: 'Menu g\u0142\u00f3wne',
      tutClose: 'Zrozumia\u0142em!',
      scoreDisplay: 'Punkty: {score}', livesDisplay: '\u017bycia: {n}',
      bestDisplay: 'Najlepszy: {score}', xpDisplay: 'Suma XP: {xp}',
      keysDisplay: 'Klucze: {n}', selectDifficulty: 'Wybierz trudno\u015b\u0107',
      levelCleared: 'POZIOM UKO\u0143CZONY!', wins: '{name} WYGRYWA!'
    }},
    'cs-CZ': { name: 'Czech', nativeName: '\u010ce\u0161tina', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Sk\u00f3re', lives: '\u017divoty', best: 'Nejlep\u0161\u00ed', keys: 'Kl\u00ed\u010de',
      howToPlay: 'Jak hr\u00e1t', language: 'Jazyk',
      retry: 'ZKUSIT ZNOVU', mainMenu: 'HLAVN\u00cd MENU', gameOver: 'KONEC HRY',
      youWin: 'VYHR\u00c1L JSI!', raceReady: 'P\u0159ipraven', tutClose: 'Ch\u00e1pu!',
      scoreDisplay: 'Sk\u00f3re: {score}', livesDisplay: '\u017divoty: {n}', bestDisplay: 'Nejlep\u0161\u00ed: {score}'
    }},
    'sk-SK': { name: 'Slovak', nativeName: 'Sloven\u010dina', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Sk\u00f3re', lives: '\u017divoty', best: 'Najlep\u0161\u00ed', keys: 'K\u013e\u00fa\u010de',
      howToPlay: 'Ako hra\u0165', language: 'Jazyk',
      retry: 'SK\u00daSI\u0164 ZNOVA', mainMenu: 'HLAVN\u00c9 MENU', gameOver: 'KONIEC HRY',
      youWin: 'VYHRAL SI!', raceReady: 'Pripraven\u00fd', tutClose: 'Ch\u00e1pem!',
      scoreDisplay: 'Sk\u00f3re: {score}', livesDisplay: '\u017divoty: {n}', bestDisplay: 'Najlep\u0161\u00ed: {score}'
    }},
    'hu-HU': { name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Pont', lives: '\u00c9letek', best: 'Legjobb', keys: 'Kulcsok',
      howToPlay: 'Hogyan j\u00e1tssz', language: 'Nyelv',
      retry: '\u00daJRA', mainMenu: 'F\u0150MEN\u00dc', gameOver: 'J\u00c1T\u00c9K V\u00c9GE',
      youWin: 'NYERT\u00c9L!', raceReady: 'K\u00e9sz', tutClose: 'Meg\u00e9rtettem!',
      scoreDisplay: 'Pont: {score}', livesDisplay: '\u00c9letek: {n}', bestDisplay: 'Legjobb: {score}'
    }},
    'ro-RO': { name: 'Romanian', nativeName: 'Rom\u00e2n\u0103', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Scor', lives: 'Vie\u021bi', best: 'Cel mai bun', keys: 'Chei',
      howToPlay: 'Cum s\u0103 joci', language: 'Limb\u0103',
      retry: '\u00ceNCEARC\u0102 DIN NOU', mainMenu: 'MENIU PRINCIPAL', gameOver: 'SF\u00c2R\u0218IT DE JOC',
      youWin: 'AI C\u00c2\u0218TIGAT!', raceReady: 'Gata', tutClose: 'Am \u00een\u021beles!',
      scoreDisplay: 'Scor: {score}', livesDisplay: 'Vie\u021bi: {n}', bestDisplay: 'Cel mai bun: {score}'
    }},
    'bg-BG': { name: 'Bulgarian', nativeName: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442', lives: '\u0416\u0438\u0432\u043e\u0442\u0438', best: '\u041d\u0430\u0439-\u0434\u043e\u0431\u0440\u043e', keys: '\u041a\u043b\u044e\u0447\u043e\u0432\u0435',
      howToPlay: '\u041a\u0430\u043a \u0441\u0435 \u0438\u0433\u0440\u0430\u0435', language: '\u0415\u0437\u0438\u043a',
      retry: '\u041e\u041f\u0418\u0422\u0410\u0419 \u041f\u0410\u041a', mainMenu: '\u041e\u0421\u041d\u041e\u0412\u041d\u041e \u041c\u0415\u041d\u042e', gameOver: '\u0418\u0413\u0420\u0410\u0422\u0410 \u041f\u0420\u0418\u041a\u041b\u042e\u0427\u0418',
      youWin: '\u0422\u0418 \u041f\u041e\u0411\u0415\u0414\u0418!', raceReady: '\u0413\u043e\u0442\u043e\u0432', tutClose: '\u0420\u0430\u0437\u0431\u0440\u0430\u0445!',
      scoreDisplay: '\u0420\u0435\u0437\u0443\u043b\u0442\u0430\u0442: {score}', livesDisplay: '\u0416\u0438\u0432\u043e\u0442\u0438: {n}', bestDisplay: '\u041d\u0430\u0439-\u0434\u043e\u0431\u0440\u043e: {score}'
    }},
    'sr-RS': { name: 'Serbian', nativeName: '\u0421\u0440\u043f\u0441\u043a\u0438', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u041f\u043e\u0435\u043d\u0438', lives: '\u0416\u0438\u0432\u043e\u0442\u0438', best: '\u041d\u0430\u0458\u0431\u043e\u0459\u0438', keys: '\u041a\u0459\u0443\u0447\u0435\u0432\u0438',
      howToPlay: '\u041a\u0430\u043a\u043e \u0438\u0433\u0440\u0430\u0442\u0438', language: '\u0408\u0435\u0437\u0438\u043a',
      retry: '\u041f\u041e\u041a\u0423\u0428\u0410\u0408 \u041f\u041e\u041d\u041e\u0412\u041e', mainMenu: '\u0413\u041b\u0410\u0412\u041d\u0418 \u041c\u0415\u041d\u0418', gameOver: '\u0418\u0413\u0420\u0410 \u0408\u0415 \u0413\u041e\u0422\u041e\u0412\u0410',
      raceReady: '\u0421\u043f\u0440\u0435\u043c\u0430\u043d', tutClose: '\u0420\u0430\u0437\u0443\u043c\u0435\u043e!',
      scoreDisplay: '\u041f\u043e\u0435\u043d\u0438: {score}', livesDisplay: '\u0416\u0438\u0432\u043e\u0442\u0438: {n}', bestDisplay: '\u041d\u0430\u0458\u0431\u043e\u0459\u0438: {score}'
    }},
    'hr-HR': { name: 'Croatian', nativeName: 'Hrvatski', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Bodovi', lives: '\u017divoti', best: 'Najbolji', keys: 'Klju\u010devi',
      howToPlay: 'Kako igrati', language: 'Jezik',
      retry: 'POKU\u0160AJ PONOVNO', mainMenu: 'GLAVNI IZBORNIK', gameOver: 'KRAJ IGRE',
      youWin: 'POBJEDIO SI!', raceReady: 'Spreman', tutClose: 'Shva\u0107am!',
      scoreDisplay: 'Bodovi: {score}', livesDisplay: '\u017divoti: {n}', bestDisplay: 'Najbolji: {score}'
    }},
    'uk-UA': { name: 'Ukrainian', nativeName: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: '\u041e\u0447\u043a\u0438', lives: '\u0416\u0438\u0442\u0442\u044f', best: '\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0438\u0439', keys: '\u041a\u043b\u044e\u0447\u0456',
      howToPlay: '\u042f\u043a \u0433\u0440\u0430\u0442\u0438', language: '\u041c\u043e\u0432\u0430',
      retry: '\u0421\u041f\u0420\u041e\u0411\u0423\u0419 \u0417\u041d\u041e\u0412\u0423', mainMenu: '\u0413\u041e\u041b\u041e\u0412\u041d\u0415 \u041c\u0415\u041d\u042e', gameOver: '\u0413\u0420\u0410 \u0417\u0410\u041a\u0406\u041d\u0427\u0418\u041b\u0410\u0421\u042c',
      youWin: '\u0422\u0418 \u041f\u0415\u0420\u0415\u041c\u0406\u0413!', raceReady: '\u0413\u043e\u0442\u043e\u0432\u0438\u0439', tutClose: '\u0417\u0440\u043e\u0437\u0443\u043c\u0456\u043b!',
      scoreDisplay: '\u041e\u0447\u043a\u0438: {score}', livesDisplay: '\u0416\u0438\u0442\u0442\u044f: {n}', bestDisplay: '\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0438\u0439: {score}'
    }},
    'lt-LT': { name: 'Lithuanian', nativeName: 'Lietuvi\u0173', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Ta\u0161kai', lives: 'Gyvyb\u0117s', best: 'Geriausias', keys: 'Raktai',
      howToPlay: 'Kaip \u017eaisti', language: 'Kalba',
      retry: 'BANDYTI DAR KART\u0102', mainMenu: 'PAGRINDINIS MENIU', gameOver: '\u017daidimas baigtas',
      raceReady: 'Pasiruo\u0161\u0119s', tutClose: 'Supratau!',
      scoreDisplay: 'Ta\u0161kai: {score}', livesDisplay: 'Gyvyb\u0117s: {n}', bestDisplay: 'Geriausias: {score}'
    }},
    'lv-LV': { name: 'Latvian', nativeName: 'Latvie\u0161u', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punkti', lives: 'Dz\u0127v\u012bbas', best: 'Lab\u0101kais', keys: 'Atsl\u0113gas',
      howToPlay: 'K\u0101 sp\u0113l\u0113t', language: 'Valoda',
      retry: 'M\u0112\u0122IN\u0100T V\u0112LREIZ', mainMenu: 'GALVEN\u0100 IZV\u0112LNE', gameOver: 'SP\u0112LE BEIDZAS',
      raceReady: 'Gatavs', tutClose: 'Sapratu!',
      scoreDisplay: 'Punkti: {score}', livesDisplay: 'Dz\u0127v\u012bbas: {n}', bestDisplay: 'Lab\u0101kais: {score}'
    }},
    'et-EE': { name: 'Estonian', nativeName: 'Eesti', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punktid', lives: 'Elud', best: 'Parim', keys: 'V\u00f5tmed',
      howToPlay: 'Kuidas m\u00e4ngida', language: 'Keel',
      retry: 'PROOVI UUESTI', mainMenu: 'PEAMEN\u00dc\u00dc', gameOver: 'M\u00c4NG L\u00d5PPES',
      raceReady: 'Valmis', tutClose: 'Sain aru!',
      scoreDisplay: 'Punktid: {score}', livesDisplay: 'Elud: {n}', bestDisplay: 'Parim: {score}'
    }},
    'sq-AL': { name: 'Albanian', nativeName: 'Shqip', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Pik\u00ebt', lives: 'Jet\u00ebt', best: 'M\u00eb i miri', keys: '\u00c7el\u00ebsat',
      howToPlay: 'Si t\u00eb luash', language: 'Gjuha',
      retry: 'PROVO P\u00cbRS\u00cbRI', mainMenu: 'MENUJA KRYESORE', gameOver: 'LOJA MBAROI',
      youWin: 'TI FITOVE!', raceReady: 'Gati', tutClose: 'E kuptova!',
      scoreDisplay: 'Pik\u00ebt: {score}', livesDisplay: 'Jet\u00ebt: {n}', bestDisplay: 'M\u00eb i miri: {score}'
    }},
    'ca-ES': { name: 'Catalan', nativeName: 'Catal\u00e0', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntuaci\u00f3', lives: 'Vides', best: 'Millor', keys: 'Claus',
      howToPlay: 'Com jugar', language: 'Idioma',
      retry: 'TORNA A INTENTAR-HO', mainMenu: 'MEN\u00da PRINCIPAL', gameOver: 'FI DE LA PARTIDA',
      youWin: 'HAS GUANYAT!', raceReady: 'A punt', tutClose: 'Ent\u00e8s!',
      scoreDisplay: 'Puntuaci\u00f3: {score}', livesDisplay: 'Vides: {n}', bestDisplay: 'Millor: {score}'
    }},
    'eu-ES': { name: 'Basque', nativeName: 'Euskara', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntuazioa', lives: 'Bizitzak', best: 'Onena', keys: 'Giltzak',
      howToPlay: 'Nola jolastu', language: 'Hizkuntza',
      retry: 'SAIATU BERRIRO', mainMenu: 'MENU NAGUSIA', gameOver: 'JOKOA BUKATU DA',
      youWin: 'IRABAZI DUZU!', raceReady: 'Prest', tutClose: 'Ulertu dut!',
      scoreDisplay: 'Puntuazioa: {score}', livesDisplay: 'Bizitzak: {n}', bestDisplay: 'Onena: {score}'
    }},
    'gl-ES': { name: 'Galician', nativeName: 'Galego', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Puntuaci\u00f3n', lives: 'Vidas', best: 'Mellor', keys: 'Chaves',
      howToPlay: 'Como xogar', language: 'Idioma',
      retry: 'TENTA DE NOVO', mainMenu: 'MEN\u00da PRINCIPAL', gameOver: 'FIN DO XOGO',
      youWin: 'GA\u00d1ACHES!', raceReady: 'Listo', tutClose: 'Entend\u00edn!',
      scoreDisplay: 'Puntuaci\u00f3n: {score}', livesDisplay: 'Vidas: {n}', bestDisplay: 'Mellor: {score}'
    }},
    'cy-GB': { name: 'Welsh', nativeName: 'Cymraeg', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Sg\u00f4r', lives: 'Bywydau', best: 'Gorau', keys: 'Allweddi',
      howToPlay: 'Sut i chwarae', language: 'Iaith',
      retry: 'CEISIO ETO', mainMenu: 'PRIF FWYDLEN', gameOver: 'DIWEDD GEM',
      youWin: 'RWYT WEDI ENNILL!', raceReady: 'Barod', tutClose: 'Deall!',
      scoreDisplay: 'Sg\u00f4r: {score}', livesDisplay: 'Bywydau: {n}', bestDisplay: 'Gorau: {score}'
    }},
    'gd-GB': { name: 'Scottish Gaelic', nativeName: 'G\u00e0idhlig', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Sg\u00f2r', lives: 'Beatha', best: 'As Fhe\u00e0rr', keys: 'Iuchraichean',
      howToPlay: 'Mar a chluicheas tu', language: 'C\u00e0nan',
      retry: 'FEUCH A-RITHIST', mainMenu: 'PR\u00ccOMH-CHL\u00c0R', gameOver: 'TH\u00c0NIG AN GEAMA GU CR\u00ccOCH',
      raceReady: 'Deiseil', tutClose: 'Thuig mi!',
      scoreDisplay: 'Sg\u00f2r: {score}', livesDisplay: 'Beatha: {n}', bestDisplay: 'As Fhe\u00e0rr: {score}'
    }},
    'ga-IE': { name: 'Irish', nativeName: 'Gaeilge', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Sc\u00f3r', lives: 'Saol', best: 'Is Fearr', keys: 'Eochracha',
      howToPlay: 'Conas imirt', language: 'Teanga',
      retry: 'TRIAL AR\u00cdS', mainMenu: 'PR\u00cdOMHROGHCHL\u00c1R', gameOver: 'DEIREADH AN CHLUICHE',
      raceReady: 'R\u00e9idh', tutClose: 'Tuigim!',
      scoreDisplay: 'Sc\u00f3r: {score}', livesDisplay: 'Saol: {n}', bestDisplay: 'Is Fearr: {score}'
    }},
    'mt-MT': { name: 'Maltese', nativeName: 'Malti', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Punte\u0121\u0121', lives: '\u0126ajjiet', best: 'L-Aqwa', keys: '\u0100wrief',
      howToPlay: 'Kif tilg\u0127ab', language: 'Lingwa',
      retry: 'ER\u0120A MILL-\u0120DID', mainMenu: 'MENU PRIN\u0108IPALI', gameOver: 'IL-LO\u0120BA SPI\u010a\u010aET',
      raceReady: 'Lest', tutClose: 'Fhimt!',
      scoreDisplay: 'Punte\u0121\u0121: {score}', livesDisplay: '\u0126ajjiet: {n}', bestDisplay: 'L-Aqwa: {score}'
    }},
    'is-IS': { name: 'Icelandic', nativeName: '\u00cdslenska', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Stig', lives: 'L\u00edf', best: 'Bestur', keys: 'Lykla',
      howToPlay: 'Hvernig \u00e1 a\u00f0 spila', language: 'Tungum\u00e1l',
      retry: 'REYNA AFTUR', mainMenu: 'A\u00d0ALVALMYND', gameOver: 'LEIK LOKI\u00d0',
      youWin: '\u00de\u00da VINNUR!', raceReady: 'Tilb\u00fain(n)', tutClose: 'Skili\u00f0!',
      scoreDisplay: 'Stig: {score}', livesDisplay: 'L\u00edf: {n}', bestDisplay: 'Bestur: {score}'
    }},
    'lb-LU': { name: 'Luxembourgish', nativeName: 'L\u00ebtzebuergesch', dir: 'ltr', s: {
      title: 'NEON DODGERS', score: 'Score', lives: 'Liewe', best: 'Beschten', keys: 'Schl\u00ebsselen',
      howToPlay: 'W\u00e9i spillen', language: 'Sprooch',
      retry: 'NEES VERSICHEN', mainMenu: 'HAUPTMEN\u00dc', gameOver: 'SPILL AUS',
      raceReady: 'F\u00e4erdeg', tutClose: 'Verstan!',
      scoreDisplay: 'Score: {score}', livesDisplay: 'Liewe: {n}', bestDisplay: 'Beschten: {score}'
    }}
  };
  for (var k in S) { if (S.hasOwnProperty(k)) NeonI18n.addLang(k, S[k]); }
})();
