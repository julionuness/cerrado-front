# Futuras Funcionalidades — Cerrado Front

## Pendentes de implementação

### Nível de severidade baseado em confiança
Usar o valor de confiança do modelo para inferir gravidade da detecção:
- conf < 0.60 → Suspeito
- conf 0.60–0.85 → Moderado
- conf > 0.85 → Severo

**Aguardar:** migração do modelo de detecção (bounding box) para segmentação, que trará área percentual real da folha afetada — tornando a severidade muito mais precisa.

---

### Diagnóstico por localização / talhão
Organizar os diagnósticos por área geográfica da fazenda (talhão, quadra, lote).

- Usuário associa cada análise a um talhão no momento do upload
- Histórico filtrável por talhão
- Resumo por talhão: quantas folhas doentes, qual doença predomina

**Dependência:** definir modelo de dados para talhões antes de implementar.
