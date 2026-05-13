export interface CodeSnippet {
  label: string
  language: string
  code: string
  explanation: string
}
export const CODE_SNIPPETS: Record<string, CodeSnippet[]> = {
  webwidgets: [
    {
      label: "Widget Settings",
      language: "typescript",
      code: `const persist = useDebounce(
  (next: WidgetSettings) => {
    if (!user?.id) return;
    void supabase
      .from('widget_settings')
      .upsert(
        {
          user_id: user.id,
          widget_id: widgetId,
          settings: next as unknown as Json,
        },
        { onConflict: 'user_id,widget_id' },
      );
  },
  800,
);

const updateSettings = useCallback(
  (patch: Partial<WidgetSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  },
  [persist],
);`,
      explanation:
        "Settings are debounced at 800ms before hitting Supabase — rapid preference changes don't saturate writes. A single row per (user, widget) pair keeps the table bounded regardless of how many times settings change.",
    },
    {
      label: "Layout Reconciliation",
      language: "typescript",
      code: `export function reconcileLayout(
  savedLayout: WidgetConfig[],
  trackers: Tracker[],
): WidgetConfig[] {
  let working = hydrateTrackers(
    savedLayout, trackers
  );

  const defaults = buildDefaultLayout(trackers);
  const currentIds = new Set(
    working.map((w) => w.id)
  );
  const missing = defaults.filter(
    (w) => !currentIds.has(w.id)
  );
  if (missing.length > 0)
    working = [...working, ...missing];

  if (trackers.length > 0)
    working = working.filter(
      (w) => w.type !== 'recovery-empty'
    );

  return working;
}`,
      explanation:
        "On load, the saved layout is reconciled against the current tracker set. New default widgets are injected without displacing user customizations, and the recovery-empty placeholder is removed once real trackers exist — the layout self-heals as user data evolves.",
    },
    {
      label: "Cache / Remote Race",
      language: "typescript",
      code: `const cached = readCachedLayout(userId!);
const cachedTs = readCachedTimestamp(userId!);

if (cached) {
  setLayout(reconcileLayout(cached, safeTrackers));
  setReady(true);
}

const { data } = await supabase
  .from('dashboard_layouts')
  .select('layout, updated_at')
  .eq('user_id', userId!)
  .maybeSingle();

const source = (() => {
  if (!remoteLayout) return cached;
  if (!cached || !cachedTs) return remoteLayout;
  return cachedTs > (remoteTs ?? '')
    ? cached
    : remoteLayout;
})();`,
      explanation:
        "Layout loads from localStorage immediately so the dashboard renders without delay, then reconciles with Supabase. A timestamp comparison resolves the race — the newer write wins, so offline edits aren't silently overwritten by stale remote data.",
    },
  ],
  everychurch: [
    {
      label: "Angular Service",
      language: "typescript",
      code: `@Injectable({ providedIn: 'root' })
export class ChurchService {
  private http = inject(HttpClient);
  private cache: Church[] | null = null;

  getAll(): Observable<Church[]> {
    if (this.cache !== null) {
      return of(this.cache);
    }
    return this.http
      .get<Church[]>(this.base)
      .pipe(
        tap((churches) =>
          (this.cache = churches)
        )
      );
  }

  create(church: Church): Observable<Church> {
    return this.http
      .post<Church>(this.base, church)
      .pipe(tap(() => (this.cache = null)));
  }
}`,
      explanation:
        "An in-memory cache avoids redundant GET requests for the church list. Any mutation invalidates the cache so the next read always fetches fresh data — no stale-serving risk without needing a more complex invalidation strategy.",
    },
    {
      label: "Spring Service",
      language: "java",
      code: `@Transactional(readOnly = true)
public List<ChurchDto> findAll() {
    return repo.findAll().stream()
        .map(this::toDto)
        .toList();
}

public ChurchDto create(ChurchDto dto) {
    Church church = new Church();
    applyDto(church, dto);
    return toDto(repo.save(church));
}

private ChurchDto toDto(Church c) {
    List<ServiceTimeDto> times =
        c.getServiceTimes().stream()
         .map(s -> new ServiceTimeDto(
             s.getId(), s.getDayOfWeek(),
             s.getTime(), s.getType(),
             s.getLanguage()))
         .toList();
    return new ChurchDto(
        c.getId(), c.getName(), ...
    );
}`,
      explanation:
        "The DTO boundary keeps the JPA entity out of the HTTP layer — internal model changes don't ripple into the API contract. `@Transactional(readOnly = true)` skips Hibernate dirty-checking on list queries, cutting unnecessary overhead.",
    },
    {
      label: "REST Controller",
      language: "java",
      code: `@RestController
@RequestMapping("/api/churches")
public class ChurchController {

    @GetMapping
    public List<ChurchDto> list() {
        return churchService.findAll();
    }

    @PostMapping("/parse-url")
    public ChurchDto parseUrl(
        @RequestBody ParseUrlRequest req
    ) {
        return urlParserService.parse(req.url());
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(
        NoSuchElementException e
    ) {
        return Map.of("error", e.getMessage());
    }
}`,
      explanation:
        "Exception handlers on the controller translate domain exceptions into HTTP status codes — no try/catch scattered through service methods. The `/parse-url` endpoint drives the AI-powered church discovery flow, feeding a URL to the scraper service.",
    },
  ],
  ductmap: [
    {
      label: "Split Component",
      language: "rust",
      code: `pub fn split_component(
    &mut self,
    id: u32,
    x: f32, y: f32, z: f32,
) -> Result<SplitResult, EngineError> {
    let edge_idx = EdgeIndex::new(id as usize);
    let (from_idx, to_idx) = self.graph
        .edge_endpoints(edge_idx)
        .ok_or(EngineError::ComponentNotFound(id))?;

    let component = self.graph[edge_idx]
        .component.clone();
    let (comp_a, comp_b) = component
        .split_pair()
        .ok_or_else(|| EngineError::InvalidGeometry(
            "only straight runs and reducers \
             support splitting".into()
        ))?;

    let new_idx = self.graph.add_node(DuctNode {
        position: Point3::new(x, y, z),
    });
    self.graph.remove_edge(edge_idx);

    let ea = self.graph.add_edge(
        from_idx, new_idx, DuctEdge { component: comp_a }
    );
    let eb = self.graph.add_edge(
        new_idx, to_idx, DuctEdge { component: comp_b }
    );
    Ok(SplitResult {
        node_id: new_idx.index() as u32,
        comp_a_id: ea.index() as u32,
        comp_b_id: eb.index() as u32,
    })
}`,
      explanation:
        "Splitting an edge is atomic: the original component is pair-split into two halves, a new node is inserted at the click position, and the graph is rewired in one operation — no intermediate invalid states are observable between the remove and the two adds.",
    },
    {
      label: "Validation Engine",
      language: "rust",
      code: `ComponentType::Reducer(r) => {
    let src = r.source_dimension.area();
    let tgt = r.target_dimension.area();
    if src > 0.0 && tgt > 0.0 {
        let ratio = (src / tgt).max(tgt / src);
        if ratio > 4.0 {
            errors.push(ValidationError {
                severity: Severity::Warning,
                code: ValidationCode::InvalidReducerRatio,
                message: format!(
                    "Reducer area ratio {ratio:.1}:1 \
                     may cause excessive pressure drop"
                ),
            });
        }
    }
}

if degree > 4 {
    errors.push(ValidationError {
        severity: Severity::Warning,
        code: ValidationCode::ExcessiveConnections,
        message: format!(
            "Node has {degree} connections; \
             more than 4 is unusual for ductwork"
        ),
    });
}`,
      explanation:
        "Validation runs as a pure traversal — no mutations, no side effects. The reducer ratio check enforces a real HVAC engineering constraint (area ratios over 4:1 cause excessive pressure drop). Warnings rather than errors let users save work-in-progress layouts.",
    },
    {
      label: "WASM Bridge",
      language: "rust",
      code: `#[wasm_bindgen]
pub fn split_component(
    &mut self,
    id: u32,
    x: f32, y: f32, z: f32,
) -> Result<String, JsValue> {
    let result = self.graph
        .split_component(id, x, y, z)
        .map_err(|e| JsValue::from(e))?;
    serde_json::to_string(&result)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn validate(&self) -> String {
    let errors = self.graph.validate();
    serde_json::to_string(&errors)
        .unwrap_or_else(|_| "[]".into())
}`,
      explanation:
        "The WASM interface is kept thin — only primitives and JSON strings cross the boundary, avoiding serialization overhead for complex types. `Result<String, JsValue>` converts Rust errors into JS-catchable exceptions so TypeScript callers handle failures with normal try/catch.",
    },
  ],
  geography: [],
  clearspeak: [],
}
