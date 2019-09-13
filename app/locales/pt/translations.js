export default {

  "general": {
    "next": "próximo",
    "back": "voltar",
    "submit": "submeter",
    "cancel": "cancelar",
    "later": "adiar",
    "import": "importar",
    "continue": "continuar",
    "validate": "validar",
    "reset": "resetar",
    "open": "abrir",
    "close": "fechar",
    "or": "ou",
    "and": "e",
    "none": "nenhum(a)",
    "download": "baixar",
    "overwrite": "sobrescrever",
    "duplicate": "duplicar",
    "loading": "carregando",
    "search": "buscar",
    "save": "salvar",
    "width": "largura",
    "yes": "sim",
    "no": "não",
    "add": "adicionar",
    "imported": "importado(a)",
    "warning": "aviso",
    "error": {
     "one": "erro",
     "other": "erros"
    }
  },

  "d3.format": {
    "decimal": ",",
    "thousands": "."
  },

  "help.wiki": "Ajuda - Wiki Khartis",
  "help.documentation": "Ajuda - Documentação do Khartis",
  "help.knowMore": "Saiba mais",
  "help.createViz": "Saber mais sobre as visualizações disponíveis e como usá-las",
  "help.createViz.link": "Consultar a ajuda",

  "updater": {
    "title": "Uma atualização está disponível",
    "installAndRestart": "Instalar e reiniciar",
    "releaseNotes": "Notas de atualização",
    "installation": "Instalando..."
  },

  "project": {

    "resume": "Retomar último projeto",

    "step1": {
      "title": {
        "importData": "Importar dados",
        "fileCsv": "Ou selecionar arquivo .csv",
        "testData": "Experimentar modelos da base de dados",
        "selectAMap": "Selecionar um mapa",
        "orImportMap": "Importar mapa próprio"
      },
      "tooltip": {
        "csv": "Em arquivos com extensão .csv, use vírgula para separar colunas",
        "resumeProject": "Retomar último projeto editado neste computador",
        "importProject": "Importar projeto salvo"
      },
      "importPasteCsv": "Importar dados ao colar a partir de uma planilha",
      "pasteCsv": "Cole seus dados aqui ou arraste um arquivo .csv",
      "downloadCsvModel": "Baixar modelo (.csv)",
      "importPoject": {
        "title": "Importar ou arrastar um projeto Khartis",
        "loadError": "Não é possível carregar o arquivo selecionado",
        "projectExists": "Projeto já existe"
      },
      "search" : "Procurar por país, região, departamento, cidade...",
      "useImportedData": "Usar dados do mapa-base",
      "projectionSettings": "Configurações de projeção"
    },

    "step2": {
      "title": {
        "preview": "Pré-visualização de dados"
      },
      "import": {
        "success": "Importação realizada com sucesso",
        "fatal": "Impossível prosseguir. Por favor edite e modifique seu arquivo .csv",
        "warningsMessage": {
          "one": "Anomalia não-bloqueante",
          "other": "Anomalias não-bloqueantes"
        },
        "warning": {
          "trim": "Algumas células possuíam espaços desnecessários no início ou fim de uma palavra. Eles foram removidos ao serem importados."
        },
        "errorsMessage": {
          "one": "Anomalia bloqueante",
          "other": "Anomalias bloqueantes"
        },
        "error": {
          "header.emptyCell": "O cabeçalho parece incorreto: algumas células estão vazias.",
          "oneColumn": "Somente uma coluna foi encontrada",
          "colNumber": "Arquivo .csv mal formatado: nem todas as linhas possuem o mesmo número de colunas."
        },
        "noError": "Algum erro foi detectado",
        "correct": "corrigir",
        "rowCount": {
          "one": "linha importada",
          "other": "linhas importadas"
        },
        "colCount": {
          "one": "coluna importada",
          "other": "colunas importadas"
        },
        "geoRefColumn": "Coluna geográfica",
        "geoRefColumnNotFound": "Nenhuma coluna geográfica foi encontrada",
        "tooltip": {
          "geoRefColumn": "Esta é a coluna de sua tabela que será usada para identificar a geografia de seus dados"
        }
      },
      "editColumn": {
        "unrecognizedColumns": "Algumas células não foram reconhecidas",
        "autoCorrect": "Auto-correção"
      },
      "back": "recomeçar importando novos dados"
    }

  },

  "navigation": {

    "editColumn": "Editar uma coluna",

    "sidebar": {
      "data" : "dados",
      "visualisations" : "visualizações",
      "export": "exportar"
    }

  },

  "variable.meta": {
    "type": {
      "text": "texto",
      "numeric": "numérico",
      "geo": "código geográfico",
      "lat": "latitude",
      "lon": "longitude",
      "auto": "automático"
    }
  },

  "projection": {
    "title": "projeção",
    "settings": {
      "longitude": "longitude",
      "latitude": "latitude",
      "rotation": "rotação"
    },
    "rating": {
      "surface": "área",
      "distance": "distância",
      "angle": "ângulo"
    },
    "atlantis": {
      "name": "Atlantis",
      "description": "Esta é uma descrição"
    },
    "bertin": {
      "name": "Bertin (1953)",
      "description": "Esta é uma descrição"
    },
    "briesemeister": {
      "name": "Briesemeister",
      "description": "Esta é uma descrição"
    },
    "interrupted_goode_homolosine": {
      "name": "Goode H.",
      "description": "Esta é uma descrição"
    },
    "lambert_azimuthal_equal_area": {
      "name": "LAEA",
      "description": "Esta é uma descrição"
    },
    "mollweide": {
      "name": "Mollweide",
      "description": "Esta é uma descrição"
    },
    "natural_earth": {
      "name": "Natural Earth",
      "description": "Esta é uma descrição"
    },
    "orthographic": {
      "name": "Ortográfica",
      "description": "Esta é uma descrição"
    },
    "plate_carree": {
      "name": "Plate Carrée",
      "description": "Esta é uma descrição"
    },
    "waterman_butterfly": {
      "name": "Waterman",
      "description": "Esta é uma descrição"
    },
    "mercator": {
      "name": "Mercator",
      "description": "Esta é uma descrição"
    },
    "armadillo": {
      "name": "Armadillo",
      "description": "Esta é uma descrição"
    },
    "airocean": {
      "name": "Air Ocean",
      "description": "Esta é uma descrição"
    },
    "equalearth": {
      "name": "Equal Earth",
      "description": "Ceci est une description"
    }
  },

  "visualization": {
    "new": "Adicionar uma visualização",
    "title": {
      "choose": {
        "title": "Escolher uma visualização",
        "ordered": "exibir ordem",
        "different": "exibir diferenças",
        "combined": "combinação de variáveis",
      },
      "chooseVar": "Escolher variáveis",
      "chooseOrderedSurf": {
        "title": "Você pode gostar",
        "classes": {
          "title": "Fazer classes com seus dados?",
          "description": "Valores similares ou homogêneos são agrupados em classes para simplificar a mensagem. Eles devem ser números (volume, datas)."
        },
        "cat": {
          "title": "exibir categorias pré-existentes?",
          "description": "Cada cor é uma categoria nas séries. Os dados podem ser números (datas) ou textos (ex.: alto, médio, baixo)."
        }
      },
      "categories": "categorias",
      "nodata": "dados perdidos ou inexistentes"
    },
    "variables": {
      "choose": "Escolher uma variável",
      "noneAvailable": "Nenhuma variável compatível está disponível.",
      "checkTheTypes": "Verifique a digitação na etapa de dados.",
      "transform": "use outra variável para inserir cor nos símbolos ou compare dois símbolos"
    },
    "settings": {
      "diagram": {
        "title": "diagrama de frequência",
        "frequencies": "frequências",
        "values": "valores",
        "cumulatives": "agregados",
        "classes": "classes",
        "tooltip": {
          "title": "Isso mostra a distribuição de ocorrências de acordo com os valores das séries"
        }
      },
      "title" : "configurações",
      "symbols": "símbolos",
      "surfaces": "superfícies",
      "thresholds": "limites",
      "discretization": {
        "title": "discretização",
        "tooltip": {
          "title": "A discretização consiste em quebrar os dados em classes homogêneas"
        },
        "method": {
          "unique": "proporcional",
          "grouped": "agrupado em classes",
          "tooltip": {
            "unique": "Cada valor é traduzido por um símbolo que é estritamente proporcional a ele",
            "grouped": "Valores são agrupados em classes ordenadas"
          }
        },
        "type": {
          "regular": "intervalos regulares",
          "mean": "médias ocultas",
          "quantile": "quantis",
          "standardDeviation": "desvio padrão",
          "jenks": "jenks",
          "linear": "nenhum",
          "manual": "manual"
        }
      },
      "classes": "classes",
      "breakValue": "valor de ruptura",
      "shape": {
        "title": "forma",
        "rect": "retângulo",
        "circle": "círculo",
        "bar": "barra",
        "triangle": "triângulo"
      },
      "size": "tamanho",
      "scale": "escala",
      "contrast": {
        "title": "contraste",
        "tooltip": "Comprima ou expanda o tamanho para uma 'leitura' da informação diferente do normal"
      },
      "color": {
        "one": "cor",
        "other": "cores"
      },
      "pattern": {
        "one": "hachura",
        "other": "hachuras"
      },
      "reverse": "inverter",
      "stroke": "traçar",
      "strokeSize": "tamanho do traçado",
      "opacity": "opacidade",
      "alignment": "alinhamento",
      "spacing": "espaçamento",
      "bottom": "baixo",
      "middle": "meio",
      "top": "alto",
      "small": "pequeno",
      "medium": "médio",
      "high": "grande",
      "ownScale": {
        "title": "escala própria",
        "tooltip": "Cada variável é tratada de maneira independente uma da outra. Duas legendas resultantes. Nota: Os tamanhos dos símbolos MÁXIMOS são idênticos"
      },
      "commonScale": {
        "title": "escala comum",
        "tooltip": "Ambas as variáveis são tratadas juntas. Há somente uma legenda. Os tamanhos dos símbolos são estritamente comparáveis"
      }
    },
    "type": {
      "ordered": {
        "sym": {
          "proportional": "símbolos proporcionais",
          "ordered": "símbolos ordenados"
        },
        "surf": {
          "ordered": "cores ordenadas"
        }
      },
      "different": {
        "sym": "símbolos diferentes",
        "surf": "cores diferentes"
      },
      "combined": {
        "sym": {
          "ordered": "símbolos proporcionais coloridos (ordem)",
          "different": "símbolos proporcionais coloridos (diferença)",
          "double": "símbolos proporcionais combinados",
        }
      },
      "quanti": {
        "val_surfaces": {
          "name": "valores > áreas",
          "description": "o degradê de cores acompanha os valores"
        },
        "val_symboles": {
          "name": "valores > símbolos",
          "description": "símbolos são proporcionais aos valores"
        }
      },
      "quali": {
        "cat_surfaces": {
          "name": "categorias > áreas",
          "description": "várias cores separam categorias"
        },
        "taille_valeur": {
          "name": "categorias sobre áreas 2",
          "description": "o degradê de cores acompanha a ordem dos valores"
        },
        "cat_symboles": {
          "name": "categorias > símbolos",
          "description": "símbolos separam categorias"
        },
        "ordre_symboles": {
          "name": "categorias sobre símbolos 2",
          "description": "a ordem dos símbolos acompanha a ordem dos valores"
        }
      }
    },
    "rule": {
      "no_value": "(nenhum valor)"
    },
    "warning": {
      "rule.count": {
        "title": "anomalia não-bloqueante",
        "about": "",
        "explenation": "Você tem certeza que seus dados contêm categorias?",
        "help": {
          "_": "O número de ocorrências detectadas sugere que seus dados mostram quantidades",
          "1": "Seria mais apropriado utilizar proporcionalidade ou ordem",
          "2": "",
          "3": ""
        }
      }
    },
    "alert": {
      "remove": {
        "title": "Confirmar exclusão",
        "content": "Você tem certeza que deseja excluir esta camada?"
      },
      "bigDataSet": {
        "title": "Atenção",
        "content": "Esta camada contém uma grande quantidade de dados e exclui-la pode ocasionar problemas de funcionamento. Você deseja continuar?"
      },
      "threshold": {
        "title": "novo limite",
        "extent": "limite está fora da série estatística",
        "valueUsed": "limite já utilizado"
      }
    }
  },

  "export": {
    "title": {
      "labels": "etiquetas",
      "styles": "personalizar",
      "sizes": "dimensões",
      "legend": "legenda",
      "export": "exportar",
      "drawings": "desenhos"
    },
    "placeholder": {
      "mapTitle": "título do mapa",
      "dataSource": "fonte dos dados",
      "author": "autor(a) / créditos",
      "comment": "comentário"
    },
    "settings": {
      "labelling": {
        "text": "texto",
        "filter": "filtrar por",
        "categories": "categorias",
        "chooseCategories": "escolher",
        "threshold": "limites",
        "selectAll": "selecionar tudo",
        "unselectAll": "deselecionar tudo",
      },
      "show": "exibir",
      "reset": "resetar",
      "edit": "editar",
      "legend": {
        "stacking": "apresentação",
        "chooseLegend": "escolher",
        "roundValue": "arrendondar valores",
        "valuePrecision": "decimais"
      },
      "title": "título",
      "width": "largura",
      "height": "altura",
      "orientation": {
        "title": "orientação",
        "horizontal": "horizontal",
        "vertical": "vertical"
      },
      "borders": "margens",
      "grid": "grade",
      "backmap": "mapa-base",
      "sphere": "esfera",
      "sea": "mares",
      "parallel": "paralelo (Linha do Equador)",
      "background": "plano de fundo",
      "image": {
        "title": "imagem",
        "normal": "normal",
        "large": "grande (@2x)",
        "xLarge": "extra grande (@3x)"
      },
      "vector": "vetorial",
      "optimised": "para",
      "formatSelection": "no formato"
    },
    "drawings": {
      "text": "texto",
      "addDrawing": {
        "1": "Adicionar texto",
        "2": "ou uma seta",
        "3": "usando a barra de ferramentas vertical no lado direito da tela"
      },
      "curve": "curva",
      "strokeWidth": "traçado",
      "dash": "pontilhado",
      "shapes": "formas",
      "align": "alinhar",
      "text": "texto",
      "scale": "escala",
      "symbol": "símbolo",
      "inherited": "herdado",
      "anchor": {
        "title": "âncora",
        "onMap": "sobre o mapa",
        "onPage": "sobre a página",
        "warning": "este desenho não pode ser ancorado ao mapa. Ele já está ancorado à página",
        "tooltip": {
          "onMap": "O objeto acompanha a geografia do mapa",
          "onPage": "A posição do objeto está fixada na página"
        }
      },
      "helper": {
        "text": "Clique no mapa para adicionar texto",
        "arrow": "Clique no mapa para adicionar uma seta"
      }
    }
  },

  "legend": {
    "editTitleHere": "Editar o título da legenda"
  },

  "toolbar": {
    "blindness": {
      "menu.title": "Simulação de daltonismo",
      "type": {
        "protanopia": "protanopia (vermelho-verde)",
        "protanomaly": "protanomalia (vermelho-verde)",
        "deuteranopia": "deuteranopia (vermelho-verde)",
        "deuteranomaly": "deuteranomalia (vermelho-verde)",
        "tritanopia": "tritanopia (azul-amarelo)",
        "tritanomaly": "tritanomalia (azul-amarelo)",
        "achromatopsia": "acromatopsia",
        "achromatomaly": "acromalia"
      }
    },
    "tooltip": {
      "center": "Centralizar o mapa",
      "zoomin": "Aproximar",
      "zoomout": "Afastar",
      "info": "Informação sobre um elemento do mapa",
      "blindness": "Simulação de daltonismo",
      "drawText": "Adicionar um texto",
      "drawArrow": "Adicionar uma seta"
    }
  },

  "basemap": {
    "world": "Mundo > países (2016)",
    "german states 2016": "Alemanha > Estados (2016)",
    "german districts 2016": "Alemanha > Distritos (2016)",
    "brazil ufe 2015": "Brasil > Estados (2015)",
    "brazil mee 2015": "Brasil > mesorregiões (2015)",
    "brazil mie 2015": "Brasil > microrregiões (2015)",
    "canada prov 2016": "Canadá > províncias (2016)",
    "canada cd 2016": "Canadá > divisão do censo (2016)",
    "eu country 2013": "Europa > Estados (2016)",
    "eu nuts-2 2013": "Europa > NUTS-2 (2013)",
    "eu nuts-3 2013": "Europa > NUTS-3 (2013)",
    "eu nuts-2 2016": "Europa > NUTS-2 (2016)",
    "eu nuts-3 2016": "Europa > NUTS-3 (2016)",
    "spain prov 2015": "Espanha > províncias (2015)",
    "spain auto 2015": "Espanha > comunidades (2015)",
    "us state 2015": "Estados Unidos > Estados (2015)",
    "france dept": "França > departamentos (2016)",
    "france reg 2015": "França > regiões (2015)",
    "france reg 2016": "França > regiões (2016)",
    "france circ 2017": "França > distritos eleitorais (2012 & 2017)",
    "FR-11 com 2016": "França > municípios (2016) > Ilha de França",
    "FR-24 com 2016": "França > municípios (2016) > Centro-Vale do Líger",
    "FR-27 com 2016": "França > municípios (2016) > Borgonha-Franco-Condado",
    "FR-28 com 2016": "França > municípios (2016) > Normandia",
    "FR-32 com 2016": "França > municípios (2016) > Altos da França",
    "FR-44 com 2016": "França > municípios (2016) > Grande Leste",
    "FR-52 com 2016": "França > municípios (2016) > País do Líger",
    "FR-53 com 2016": "França > municípios (2016) > Bretanha",
    "FR-75 com 2016": "França > municípios (2016) > Nova Aquitânia",
    "FR-76 com 2016": "França > municípios (2016) > Occitânia",
    "FR-84 com 2016": "França > municípios (2016) > Auvérnia-Ródano-Alpes",
    "FR-93 com 2016": "França > municípios (2016) > Provença-Alpes-Costa Azul",
    "FR-94 com 2016": "França > municípios (2016) > Córsega",
    "FRA10 com 2016": "França > municípios (2016) > Guadelupe",
    "FRA20 com 2016": "França > municípios (2016) > Martinica",
    "FRA30 com 2016": "França > municípios (2016) > Guiana",
    "FRA40 com 2016": "França > municípios (2016) > Reunião",
    "FRA50 com 2016": "França > municípios (2016) > Mayotte",
    "FR-11 com 2017": "França > municípios (2017) > Ilha de França",
    "FR-24 com 2017": "França > municípios (2017) > Centro-Vale do Líger",
    "FR-27 com 2017": "França > municípios (2017) > Borgonha-Franco-Condado",
    "FR-28 com 2017": "França > municípios (2017) > Normandia",
    "FR-32 com 2017": "França > municípios (2017) > Altos da França",
    "FR-44 com 2017": "França > municípios (2017) > Grande Leste",
    "FR-52 com 2017": "França > municípios (2017) > País do Líger",
    "FR-53 com 2017": "França > municípios (2017) > Bretanha",
    "FR-75 com 2017": "França > municípios (2017) > Nova Aquitânia",
    "FR-76 com 2017": "França > municípios (2017) > Occitânia",
    "FR-84 com 2017": "França > municípios (2017) > Auvérnia-Ródano-Alpes",
    "FR-93 com 2017": "França > municípios (2017) > Provença-Alpes-Costa Azul",
    "FR-94 com 2017": "França > municípios (2017) > Córsega",
    "FRA10 com 2017": "França > municípios (2017) > Guadelupe",
    "FRA20 com 2017": "França > municípios (2017) > Martinica",
    "FRA30 com 2017": "França > municípios (2017) > Guiana",
    "FRA40 com 2017": "França > municípios (2017) > Reunião",
    "FRA50 com 2017": "França > municípios (2017) > Mayotte",
    "maroc reg 2015": "Marrocos > regiões (2015)",
    "maroc prov 2015": "Marrocos > províncias (2015)",
    "uk nuts1 2018": "Reino Unido > NUTS-1 (2018)",
    "uk nuts3 2018": "Reino Unido > NUTS-3 (2018)",
    "china prov 2018": "China > províncias (2018)",
    "algeria wil 2008": "Argélia > vilaietes (2008)",
    "nc com 2017": "Nova Caledônia > municípios (2017)",
    "MGP com 2018": "Grande Paris > municípios (2018)",
    "MGP iris 2016": "Grande Paris > iris (2016)"
  },

  "examples": {
    "pop": "População dos Estados (2010-2015)",
    "idh": "Evolução do IDH (1990-2014)",
    "alim": "Desnutrição (2014-2016)",
    "unesco": "Sites da UNESCO (2015)",
    "br_ufe-pop": "População (2015)",
    "fr_dpt-pop": "População (2013)",
    "fr_dpt-poverty": "Pobreza (2013)",
    "fr_reg2015-pop": "População (2013)",
    "fr_reg2015-poverty": "Pobreza (2013)",
    "fr_reg2016-pop": "População (2013)",
    "fr_reg2016-poverty": "Pobreza (2013)",
    "de_district_inhabitants": "População (31/12/2015)",
    "de_states_inhabitants_06_15": "População (2006 - 2015)",
    "fr-pres-2012-t1": "Eleição presidencial, 1º turno (2012)",
    "fr-pres-2012-t2": "Eleição presidencial, 2º turno (2012)",
    "fr-pres-2017-t1": "Eleição presidencial, 1º turno (2017)",
    "fr-pres-2017-t2": "Eleição presidencial, 2º turno (2017)",
    "es_prov-pop": "População (2000-2015)",
    "es_auto-pop": "População (2000-2015)",
    "us_state-pop": "População (2010-2015)",
    "eu_country-energie": "Porcentagem de energia renovável no consumo final bruto de energia (2005-2014)",
    "eu_country-ecommerce": "Compras feitas na internet por indivíduo em 12 meses (2004-2016)",
    "eu_nuts2-travail": "Média de horas trabalhadas por semana (2015)",
    "eu_nuts2-agriculture": "Área agrícola utilizada por tamanho das propriedades agrícolas (2013)",
    "eu_nuts3-pop": "Densidade populacional (2015)",
    "ca-prov-life-2015": "Expectativa de vida (2013-2015)",
    "ca-cd-pop-2017": "População (2011-2017)",
    "ma-reg-pop-2014": "População (2014)",
    "ma-prov-pop-2014": "População (2014)",
    "uk-nuts1-pop-2017": "População(2017)",
    "uk-nuts3-pop-2018": "População (2014-2018)",
    "cn-prov-grp-2017": "PIB Regional (2009-2017)",
    "dz-wil-pop-2008": "População (2008)",
    "nc-com-pop-2014": "População (2014)",
    "nc-com-ref-2018": "Referendo de independência (2018)",
    "MGP-com-2018-pop-2013": "População (2013)",
    "MGP-iris-2016-pop-2013": "População (2013)"
  },

  "importMap": {
    "title": "Importar seu próprio mapa",
    "importOrDrop": "importar ou largar seu mapa-base",
    "success": "Os arquivos foram processados com sucesso. Você deseja importá-los?",
    "selectId": "Selecionar identificador (ID)",
    "selectIdDescription": "Este identificador será usado para ligar polígonos (mapa-base) aos dados. Esta é a operação de \"junção\".",
    "nonUniqueKey": "Atenção: objetos diferentes compartilharão o mesmo identificador.",
    "tooBig": "O mapa-base parece grande demais! Isso pode deixar o Khartis mais lento",
    "askSimplify": "Você deseja simplificar o leiaute do polígono automaticamente?",
    "askKeepVars": {
      "title": "Manter as outras variáveis?",
      "true": "sim (para visualizá-las depois)",
      "false": "não (somente o identificador será mantido)"
    },
    "withId": "com identificador (ID)",
    "error": {
      "title": "erro",
      "noFile": "Não foi encontrado um arquivo válido",
      "unknow": "Não é possível processar os arquivos selecionados",
      "unknownProjection": "Projeção desconhecida",
      "layersOnError": "Algumas camadas apresentam erros",
      "file_load": "Não é possível carregar o arquivo selecionado",
      "dbf_num_records": "Há quantidades diferentes de arquivos .shp e .dbf",
      "dataEmpty": "Não foram encontrados dados",
    }
  },

  "reproj": {
    "title": "Configurações de projeção",
    "knowMore": "Saber mais sobre projeções",
    "initalLabel": "Projeções iniciais",
    "modifyLabel": "Mudar projeção ",
    "orWktProj4": "ou estabelecer parâmetros (formato proj4)",
    "errorWktInvalid": "wkt não é válido",
    "selectInList": "selecionar na lista"
  }
};
