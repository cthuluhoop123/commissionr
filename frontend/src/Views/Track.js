import { useParams } from 'react-router-dom';
import Progress from './Progress.js';

function Track() {
    const { trackingId } = useParams();
    return <Progress trackingId={trackingId} />;
}

export default Track;