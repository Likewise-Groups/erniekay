"use client";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
}

interface AdmissionsChecklistProps {
  items: ChecklistItem[];
  showTip?: boolean;
}

const STATUS_COLORS = {
  completed: "border-premium-green bg-premium-green/5 text-premium-green",
  active: "border-majestic-gold bg-majestic-gold/5 text-majestic-gold",
  locked: "border-outline",
};

const STATUS_ICONS = {
  completed: "check",
  active: "radio_button_checked",
  locked: "radio_button_unchecked",
};

export default function AdmissionsChecklist({
  items,
  showTip = true,
}: AdmissionsChecklistProps) {
  return (
    <aside className="hidden xl:block w-[320px] bg-white border-l border-outline-variant p-8 overflow-y-auto max-h-[calc(100vh-80px)] sticky top-20">
      <h4 className="font-label-caps text-label-caps text-royal-navy mb-8 border-b border-majestic-gold pb-2 inline-block">
        ACADEMY REQUIREMENTS
      </h4>

      <ul className="space-y-6">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex gap-4 items-start group ${
              item.status === "locked" ? "opacity-40" : ""
            }`}
          >
            <div
              className={`mt-1 w-5 h-5 flex items-center justify-center border rounded-full ${STATUS_COLORS[item.status]}`}
            >
              <span
                className="material-symbols-outlined text-xs"
                style={
                  item.status === "completed"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {STATUS_ICONS[item.status]}
              </span>
            </div>
            <div>
              <p className="font-body-bold text-sm text-royal-navy">
                {item.title}
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Tip Section */}
      {showTip && (
        <div className="mt-16 pt-8 border-t border-outline-variant">
          <div className="bg-surface-container-low p-6">
            <span
              className="material-symbols-outlined text-royal-navy mb-3 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h5 className="font-headline-md text-lg text-royal-navy mb-2">
              Artistic Edge
            </h5>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Successful applicants often include a 500-word statement regarding
              their vision for the future of the beauty industry.
            </p>
          </div>
        </div>
      )}

      {/* Context Image */}
      <div className="mt-12 group overflow-hidden border border-outline-variant">
        <img
          className="w-full grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
          alt="Elite beauty academy workspace with luxury interior design"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Y71wm9gBwjXIH7OapGMU9aJm9sX8MB9BobScdKUa7SfPZwJQdQHY6O8KpPpQ6QII9YLQxEJHKVmo7i6k_tFGYxrBJlMyTD7X71CScj7nYSsXbzGlU0VSoaktCLD-y7K2AUtemaCkeOWWQIw6GukdxGTQtk-fqq4CCPU7Hwol2VpUyO82n6skSh0P3Bk6RPgfTAeFHBF0ESzGbAJ4Xxb_8Ar7FQxpmMU1KKAX-8ONv4-on641keTTj64kpixcwxtH7NCZvNkF5qk"
        />
      </div>
    </aside>
  );
}
