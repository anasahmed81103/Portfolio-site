import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import MediaSlideshow from '../MediaSlideshow';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';
import {
  notebookPhotos,
  PROJECT_CREDIT,
  STAND_IN_CREDIT,
} from '../notebookPhotos';

const THI_PLATES = [
  {
    src: notebookPhotos.transformer,
    alt: 'Electrical equipment — stand-in for the Transformer Health Indexing System',
    label: 'Fig. A1',
    caption: 'THI-Portal — the interface that reads a transformer as it stands.',
    credit: STAND_IN_CREDIT,
  },
  {
    src: notebookPhotos.powerLines,
    alt: 'High-voltage transmission lines — stand-in field plate',
    label: 'Fig. A2',
    caption: 'YOLOv8 in the field — detection without the bias of a clipboard.',
    credit: STAND_IN_CREDIT,
  },
  {
    src: notebookPhotos.dataCharts,
    alt: 'Charts used as a stand-in for model evaluation',
    label: 'Fig. A3',
    caption: 'Weights, latency, mAP — the triangle every industrial model must survive.',
    credit: STAND_IN_CREDIT,
  },
] as const;

/** PAGE 3 — Featured projects. */
function ProjectsPage() {
  return (
    <NewspaperPage className="np-projects" folio="Page 3 — Projects">
      <NewspaperHeader variant="interior" sectionTitle="Featured Projects" />

      <section className="np-project-lead">
        <div className="np-project-lead-copy">
          <p className="np-kicker">Lead Story · Industrial Project for K-Electric</p>
          <h2 className="np-headline np-headline-xl">
            Transformer Health Indexing System
          </h2>
          <p className="np-dek">
            Automating the health of a city’s power — so assessment no longer
            depends on who held the clipboard.
          </p>
          <p className="np-meta-line">
            <span>YOLOv8</span>
            <span>PyTorch</span>
            <span>FastAPI</span>
            <span>Next.js</span>
          </p>
          <Article dropCap>
            <p>
              <strong>The challenge.</strong> Power-distribution health was
              still a human judgement. The brief was to remove that bias —
              industrial computer vision, not a prettier form.
            </p>
            <p>
              <strong>The implementation.</strong> Anas led a production vision
              pipeline in YOLOv8 and PyTorch, then connected the models to an
              asynchronous microservices platform: FastAPI behind Next.js
              interfaces operators could actually use.
            </p>
            <p>
              <strong>The result.</strong> Model weights tuned to hold the line
              between runtime latency and Mean Average Precision — fast enough
              for the field, accurate enough for the grid.
            </p>
          </Article>
        </div>
        <div className="np-project-lead-media">
          <MediaSlideshow
            slides={THI_PLATES}
            aspect="wide"
            intervalMs={4500}
          />
          <HandAnnotation className="np-projects-note">
            the grid, seen clearly
          </HandAnnotation>
        </div>
      </section>

      <div className="np-double-rule" aria-hidden="true" />

      {/* CrossViewNet — full-width story for ultra-wide result strips */}
      <section className="np-crossview">
        <div className="np-crossview-head">
          <p className="np-kicker">Research revival · CVPR lineage</p>
          <h3 className="np-headline np-headline-xl">
            CrossViewNet: Aerial to Ground Scene Synthesis
          </h3>
          <p className="np-meta-line">
            <span>PyTorch 2.x</span>
            <span>Pix2Pix GAN</span>
            <span>U-Net</span>
            <span>AMP</span>
          </p>
          <p className="np-crossview-dek">
            A legacy CVPR framework brought into PyTorch 2.x — an eight-stage
            U-Net Pix2Pix GAN synthesizing photorealistic 360° panoramas from
            top-down aerial imagery. Multi-scale hypercolumns stayed inside a
            4GB VRAM budget through Automatic Mixed Precision. The plates below
            are the model’s own long views: input, target, and synthesis, side
            by side.
          </p>
        </div>

        <div className="np-crossview-plates">
          <NewspaperPhoto
            src={notebookPhotos.cross1}
            alt="CrossViewNet result strip — semantic map, ground truth, and generated view of a mountain road"
            aspect="banner"
            caption="Plate I — Segmentation · ground truth · network synthesis along one mountain corridor."
            credit={`${PROJECT_CREDIT} · Fig. B1`}
            className="np-crossview-plate"
          />
          <NewspaperPhoto
            src={notebookPhotos.cross2}
            alt="CrossViewNet result strip — aerial input, countryside panorama, and channel visualisation"
            aspect="banner"
            caption="Plate II — Aerial cue · rural panorama · colour-channel readout from the same pipeline."
            credit={`${PROJECT_CREDIT} · Fig. B2`}
            className="np-crossview-plate"
          />
        </div>
        <HandAnnotation className="np-projects-note">
          long views — from sky to street
        </HandAnnotation>
      </section>

      <div className="np-double-rule" aria-hidden="true" />

      <div className="np-project-grid">
        <article className="np-project-card">
          <NewspaperPhoto
            src={notebookPhotos.gazeEye}
            alt="Close photograph of an eye — stand-in for gaze detection"
            aspect="landscape"
            caption="Attention, measured — twenty-five frames a second, no GPU required."
            credit={`${STAND_IN_CREDIT} · Fig. C`}
          />
          <p className="np-kicker">On-device intelligence</p>
          <h3 className="np-headline">Gaze Detection AI System</h3>
          <p className="np-meta-line">
            <span>EfficientNet-B0</span>
            <span>MediaPipe</span>
            <span>~25 FPS CPU</span>
          </p>
          <p>
            EfficientNet-B0 fine-tuned to read structural facial coordinates in
            real time on native CPU. MediaPipe landmark arrays map regions of
            interest even under shadow and poor exposure — gaze tracking that
            still holds in difficult light.
          </p>
        </article>

        <article className="np-project-card">
          <NewspaperPhoto
            src={notebookPhotos.airplane}
            alt="Aircraft in flight — stand-in for the AirWizz booking system"
            aspect="landscape"
            caption="Tickets, currency, and a payment rail — all in one engine."
            credit={`${STAND_IN_CREDIT} · Fig. D`}
          />
          <p className="np-kicker">Enterprise brief</p>
          <h3 className="np-headline">AirWizz Flight Booking System</h3>
          <p className="np-meta-line">
            <span>.NET Core MVC</span>
            <span>C#</span>
            <span>SQL Server</span>
            <span>EF Core</span>
            <span>HBL</span>
          </p>
          <p>
            A full booking engine in ASP.NET Core MVC, backed by a tightly
            normalised SQL Server schema through Entity Framework. Live
            currency conversion and HBL payment integration sit in the same
            ledger — travel, treated as a serious transactional system.
          </p>
        </article>
      </div>
    </NewspaperPage>
  );
}

export default ProjectsPage;
