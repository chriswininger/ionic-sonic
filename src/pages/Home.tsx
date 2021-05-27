import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import AudioFrameList from '../components/AudioFrameList/AudioFrameList';
import AudioControls from '../components/AudioControls/AudioControls';

export default function Home() {
  const TITLE = 'Ionic Sonic';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{TITLE}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{TITLE}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="is-page-content">
          <AudioControls />

          <AudioFrameList />
        </div>
      </IonContent>
    </IonPage>
  );
};
