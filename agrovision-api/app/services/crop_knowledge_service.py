
import unicodedata


class CropKnowledgeService:

    def __init__(self):
        self.crops = {
            "tomate": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Tizón temprano",
                    "Tizón tardío",
                    "Manchas foliares"
                ],
                "sintomas": [
                    "Manchas marrones en las hojas",
                    "Amarillamiento del follaje",
                    "Secamiento de tejido foliar"
                ],
                "descripcion": (
                    "El tomate puede presentar manchas "
                    "foliares, amarillamiento y necrosis "
                    "asociados a diferentes problemas "
                    "fitosanitarios. Entre las enfermedades "
                    "a considerar se encuentran el tizón "
                    "temprano y el tizón tardío. Su presencia "
                    "debe confirmarse mediante inspección."
                ),
                "recomendaciones": [
                    "Inspeccionar hojas superiores e inferiores.",
                    "Evitar mojar innecesariamente el follaje.",
                    "Retirar material muy deteriorado cuando corresponda.",
                    "Consultar a un técnico agrícola."
                ],
                "prevencion": [
                    "Mantener ventilación adecuada.",
                    "Monitorear periódicamente las plantas.",
                    "Utilizar material vegetal sano."
                ]
            },

            "grama": {
                "tipo_problema": "Estrés y alteraciones del césped",
                "problemas": [
                    "Manchas foliares",
                    "Estrés hídrico",
                    "Daños por hongos"
                ],
                "sintomas": [
                    "Zonas amarillentas",
                    "Manchas marrones",
                    "Pérdida de vigor"
                ],
                "descripcion": (
                    "La grama puede presentar decoloración, "
                    "manchas y pérdida de vigor por problemas "
                    "de humedad, nutrición o enfermedades "
                    "foliares. La causa requiere inspección."
                ),
                "recomendaciones": [
                    "Revisar la frecuencia del riego.",
                    "Evitar encharcamientos.",
                    "Inspeccionar las zonas deterioradas.",
                    "Mantener un corte adecuado."
                ],
                "prevencion": [
                    "Conservar buen drenaje.",
                    "Evitar exceso de fertilización.",
                    "Realizar mantenimiento periódico."
                ]
            },

            "coco": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Manchas foliares",
                    "Deficiencias nutricionales",
                    "Daños por plagas"
                ],
                "sintomas": [
                    "Manchas circulares en las hojas",
                    "Amarillamiento",
                    "Necrosis foliar"
                ],
                "descripcion": (
                    "Las palmas de coco pueden presentar "
                    "manchas circulares, amarillamiento "
                    "y deterioro foliar. Estos signos pueden "
                    "tener diferentes causas, incluidas "
                    "alteraciones nutricionales y problemas "
                    "fitosanitarios."
                ),
                "recomendaciones": [
                    "Inspeccionar las hojas afectadas.",
                    "Revisar el estado nutricional.",
                    "Mantener un riego adecuado.",
                    "Solicitar evaluación agronómica."
                ],
                "prevencion": [
                    "Monitorear periódicamente el follaje.",
                    "Mantener buen drenaje.",
                    "Aplicar fertilización según análisis del suelo."
                ]
            },

            "alcapa": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Manchas foliares",
                    "Estrés por humedad",
                    "Daños por insectos"
                ],
                "sintomas": [
                    "Decoloración de hojas",
                    "Manchas superficiales",
                    "Deterioro de bordes foliares"
                ],
                "descripcion": (
                    "La planta registrada como alcapa puede "
                    "presentar alteraciones en sus hojas por "
                    "problemas ambientales o fitosanitarios. "
                    "La identificación botánica exacta "
                    "debe confirmarse antes de asociar "
                    "enfermedades específicas."
                ),
                "recomendaciones": [
                    "Revisar ambas caras de las hojas.",
                    "Mantener humedad sin encharcamiento.",
                    "Inspeccionar posibles insectos.",
                    "Retirar hojas deterioradas cuando corresponda."
                ],
                "prevencion": [
                    "Mantener condiciones adecuadas de cultivo.",
                    "Evitar acumulación excesiva de humedad.",
                    "Realizar inspecciones periódicas."
                ]
            },

            "naranja": {
                "tipo_problema": "Alteraciones en frutos y follaje",
                "problemas": [
                    "Manchas en frutos",
                    "Manchas foliares",
                    "Alteraciones nutricionales"
                ],
                "sintomas": [
                    "Manchas oscuras en frutos",
                    "Cambios de coloración en hojas",
                    "Pigmentación irregular"
                ],
                "descripcion": (
                    "Los naranjos pueden presentar manchas "
                    "en frutos y hojas relacionadas con "
                    "diversas causas. Las alteraciones "
                    "superficiales requieren inspección "
                    "para diferenciar daños ambientales, "
                    "plagas y enfermedades."
                ),
                "recomendaciones": [
                    "Inspeccionar frutos y hojas.",
                    "Registrar la evolución de las manchas.",
                    "Revisar condiciones de riego y nutrición.",
                    "Consultar a un especialista en cítricos."
                ],
                "prevencion": [
                    "Mantener buenas prácticas de manejo.",
                    "Inspeccionar periódicamente los frutos.",
                    "Utilizar material vegetal sano."
                ]
            },

            "melon": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Oídio",
                    "Mildiu",
                    "Estrés nutricional"
                ],
                "sintomas": [
                    "Amarillamiento de hojas",
                    "Manchas foliares",
                    "Pérdida de vigor"
                ],
                "descripcion": (
                    "El melón puede presentar alteraciones "
                    "foliares asociadas a enfermedades como "
                    "oídio y mildiu, además de problemas "
                    "ambientales. La observación de síntomas "
                    "es necesaria para orientar su evaluación."
                ),
                "recomendaciones": [
                    "Revisar ambas caras de las hojas.",
                    "Mantener ventilación adecuada.",
                    "Evitar exceso de humedad.",
                    "Monitorear la evolución de las manchas."
                ],
                "prevencion": [
                    "Evitar encharcamientos.",
                    "Mantener distancias adecuadas entre plantas.",
                    "Realizar monitoreo fitosanitario."
                ]
            },

            "limo injertado": {
                "tipo_problema": "Alteraciones de cítricos",
                "problemas": [
                    "Manchas foliares",
                    "Deficiencias nutricionales",
                    "Problemas en la unión del injerto"
                ],
                "sintomas": [
                    "Amarillamiento foliar",
                    "Manchas en hojas",
                    "Deterioro de ramas"
                ],
                "descripcion": (
                    "El limonero injertado puede presentar "
                    "alteraciones foliares y problemas "
                    "relacionados con el manejo del cultivo "
                    "o la zona del injerto. Es importante "
                    "revisar tanto el follaje como la unión "
                    "entre patrón y variedad."
                ),
                "recomendaciones": [
                    "Inspeccionar la zona del injerto.",
                    "Revisar hojas y ramas.",
                    "Mantener riego adecuado.",
                    "Evaluar la nutrición del cultivo."
                ],
                "prevencion": [
                    "Utilizar material de injerto sano.",
                    "Evitar daños en la unión del injerto.",
                    "Mantener monitoreo periódico."
                ]
            },

            "papaya grande": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Mancha anular de la papaya",
                    "Deficiencias nutricionales",
                    "Daños por plagas"
                ],
                "sintomas": [
                    "Amarillamiento foliar",
                    "Mosaicos de coloración",
                    "Deformación de hojas"
                ],
                "descripcion": (
                    "La papaya puede presentar amarillamiento, "
                    "mosaicos y deformaciones foliares. "
                    "Estos síntomas pueden asociarse a "
                    "diferentes problemas, incluidos virus "
                    "vegetales, plagas y deficiencias."
                ),
                "recomendaciones": [
                    "Inspeccionar hojas nuevas y antiguas.",
                    "Revisar presencia de insectos vectores.",
                    "Mantener nutrición equilibrada.",
                    "Solicitar evaluación fitosanitaria."
                ],
                "prevencion": [
                    "Monitorear posibles vectores.",
                    "Utilizar plantas sanas.",
                    "Mantener limpieza de herramientas."
                ]
            },

            "banano comun": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Sigatoka",
                    "Necrosis foliar",
                    "Estrés ambiental"
                ],
                "sintomas": [
                    "Manchas oscuras",
                    "Áreas de tejido seco",
                    "Amarillamiento de hojas"
                ],
                "descripcion": (
                    "El banano puede presentar manchas, "
                    "necrosis y amarillamiento foliar. "
                    "Estas alteraciones pueden tener "
                    "diferentes causas y deben evaluarse "
                    "antes de atribuirlas a una enfermedad "
                    "específica como la sigatoka."
                ),
                "recomendaciones": [
                    "Inspeccionar hojas afectadas.",
                    "Revisar las condiciones de humedad.",
                    "Mantener buen drenaje.",
                    "Consultar a un especialista agrícola."
                ],
                "prevencion": [
                    "Monitorear periódicamente las hojas.",
                    "Mantener prácticas de saneamiento.",
                    "Evitar acumulación excesiva de humedad."
                ]
            },

            "cafe": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Roya del cafeto",
                    "Manchas foliares",
                    "Deficiencias nutricionales"
                ],
                "sintomas": [
                    "Manchas amarillentas",
                    "Pérdida de coloración",
                    "Caída prematura de hojas"
                ],
                "descripcion": (
                    "El café puede presentar manchas "
                    "amarillentas, deterioro foliar "
                    "y pérdida de hojas. Entre las "
                    "afecciones que requieren vigilancia "
                    "se encuentra la roya del cafeto."
                ),
                "recomendaciones": [
                    "Inspeccionar el envés de las hojas.",
                    "Revisar la nutrición del cultivo.",
                    "Monitorear posibles manchas.",
                    "Solicitar asesoría agronómica."
                ],
                "prevencion": [
                    "Mantener manejo adecuado de sombra.",
                    "Realizar inspecciones periódicas.",
                    "Utilizar variedades apropiadas."
                ]
            },

            "limon persa": {
                "tipo_problema": "Alteraciones de cítricos",
                "problemas": [
                    "Manchas foliares",
                    "Deficiencias nutricionales",
                    "Daños por plagas"
                ],
                "sintomas": [
                    "Amarillamiento",
                    "Manchas en hojas",
                    "Alteraciones en frutos"
                ],
                "descripcion": (
                    "El limón persa puede presentar "
                    "alteraciones en hojas y frutos "
                    "asociadas a diferentes problemas "
                    "ambientales, nutricionales "
                    "o fitosanitarios."
                ),
                "recomendaciones": [
                    "Inspeccionar hojas y frutos.",
                    "Revisar condiciones nutricionales.",
                    "Monitorear presencia de plagas.",
                    "Consultar a un especialista."
                ],
                "prevencion": [
                    "Mantener un manejo adecuado del riego.",
                    "Utilizar material vegetal sano.",
                    "Realizar monitoreo periódico."
                ]
            },

            "cana de azucar": {
                "tipo_problema": "Alteraciones foliares",
                "problemas": [
                    "Roya de la caña",
                    "Manchas foliares",
                    "Estrés nutricional"
                ],
                "sintomas": [
                    "Manchas rojizas o marrones",
                    "Amarillamiento",
                    "Deterioro del tejido foliar"
                ],
                "descripcion": (
                    "La caña de azúcar puede presentar "
                    "manchas foliares, amarillamiento "
                    "y pérdida de vigor asociados a "
                    "diversos problemas fitosanitarios "
                    "y ambientales."
                ),
                "recomendaciones": [
                    "Inspeccionar periódicamente las hojas.",
                    "Evaluar el estado nutricional.",
                    "Registrar la evolución de las manchas.",
                    "Consultar a un técnico agrícola."
                ],
                "prevencion": [
                    "Utilizar material de siembra sano.",
                    "Mantener monitoreo fitosanitario.",
                    "Aplicar buenas prácticas agrícolas."
                ]
            }
        }

    @staticmethod
    def normalize(text: str):
        text = unicodedata.normalize(
            "NFKD",
            str(text or "").lower().strip()
        )

        return "".join(
            character
            for character in text
            if not unicodedata.combining(character)
        )

    def get_crop_information(self, crop: dict):
        candidates = [
            crop.get("nombre"),
            crop.get("tipo")
        ]

        for candidate in candidates:
            normalized = self.normalize(candidate)

            if normalized in self.crops:
                return self.crops[normalized]

        return None


crop_knowledge_service = CropKnowledgeService()
