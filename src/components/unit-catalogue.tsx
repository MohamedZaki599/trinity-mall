"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { units } from "@/content/project";

export function UnitCatalogue() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [offer, setOffer] = useState("All");
  const [sort, setSort] = useState("area-asc");
  const visible = useMemo(() => units.filter((unit) => (type === "All" || unit.unitType === type) && (offer === "All" || unit.offerType === offer) && `${unit.title} ${unit.intendedUses.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "area-desc" ? b.areaSqm - a.areaSqm : a.areaSqm - b.areaSqm), [query, type, offer, sort]);
  function clear() { setQuery(""); setType("All"); setOffer("All"); setSort("area-asc"); }
  return <>
    <section className="catalogue-controls" aria-label="Unit filters"><label>Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sample units" /></label><label>Type<select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Commercial</option><option>Administrative</option></select></label><label>Offer<select value={offer} onChange={(e) => setOffer(e.target.value)}><option>All</option><option>Sale</option><option>Lease</option></select></label><label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="area-asc">Area: low to high</option><option value="area-desc">Area: high to low</option></select></label><button className="text-button" onClick={clear}>Clear filters</button></section>
    <div className="unit-grid">{visible.map((unit) => <article className="unit-card" key={unit.id}><div className="unit-card-image"><Image src={unit.image} alt={unit.imageAlt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><div className="unit-card-copy"><div className="eyebrow-row"><span className="eyebrow">Sample data</span><span>{unit.offerType}</span></div><h2>{unit.title}</h2><p>{unit.unitType} · Illustrative {unit.areaSqm} m²</p><p className="muted">{unit.description}</p><Link className="card-link" href={`/units/${unit.slug}`}>View sample details <span>→</span></Link></div></article>)}</div>
    {!visible.length && <div className="empty-state"><h2>No sample units match these filters.</h2><p>Try clearing a filter or searching a broader term.</p><button className="button button-outline" onClick={clear}>Reset filters</button></div>}
  </>;
}
