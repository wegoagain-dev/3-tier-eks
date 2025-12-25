"""
Tests for the data models.
"""
from app.models.models import Topic, Question


class TestTopicModel:
    """Test suite for the Topic model."""

    def test_topic_creation(self, app):
        """Test that a Topic can be created and serialised."""
        from app.models import db
        
        with app.app_context():
            topic = Topic(
                name='Docker',
                description='Container orchestration basics',
                slug='docker'
            )
            db.session.add(topic)
            db.session.commit()
            
            # Verify it was saved
            saved_topic = Topic.query.filter_by(slug='docker').first()
            assert saved_topic is not None
            assert saved_topic.name == 'Docker'

    def test_topic_to_dict(self, app):
        """Test the Topic.to_dict() method."""
        from app.models import db
        
        with app.app_context():
            topic = Topic(
                name='Kubernetes',
                description='Container orchestration platform',
                slug='kubernetes'
            )
            db.session.add(topic)
            db.session.commit()
            
            topic_dict = topic.to_dict()
            assert topic_dict['id'] == 'kubernetes'
            assert topic_dict['title'] == 'Kubernetes'
            assert topic_dict['description'] == 'Container orchestration platform'


class TestQuestionModel:
    """Test suite for the Question model."""

    def test_question_creation(self, app):
        """Test that a Question can be created with a Topic."""
        from app.models import db
        
        with app.app_context():
            topic = Topic(
                name='CI/CD',
                description='Continuous Integration and Deployment',
                slug='cicd'
            )
            db.session.add(topic)
            db.session.commit()
            
            question = Question(
                topic_id=topic.id,
                question_text='What does CI stand for?',
                options=['Continuous Integration', 'Code Inspection', 'Container Image', 'Cloud Infrastructure'],
                correct_answer=0
            )
            db.session.add(question)
            db.session.commit()
            
            saved_question = Question.query.first()
            assert saved_question is not None
            assert saved_question.question_text == 'What does CI stand for?'
            assert len(saved_question.options) == 4

    def test_question_shuffle_preserves_correct_answer(self, app):
        """Test that shuffling options correctly tracks the right answer."""
        from app.models import db
        
        with app.app_context():
            topic = Topic(
                name='Testing',
                description='Software testing concepts',
                slug='testing'
            )
            db.session.add(topic)
            db.session.commit()
            
            question = Question(
                topic_id=topic.id,
                question_text='What is unit testing?',
                options=['Testing individual components', 'Testing the whole system', 'Testing user interface', 'Testing performance'],
                correct_answer=0  # 'Testing individual components' is correct
            )
            db.session.add(question)
            db.session.commit()
            
            # Get shuffled version
            shuffled = question.shuffle_options()
            
            # The correct answer should still be 'Testing individual components'
            correct_option_text = shuffled['options'][shuffled['correct_answer']]
            assert correct_option_text == 'Testing individual components'

    def test_question_to_dict_with_shuffle(self, app):
        """Test the Question.to_dict() method with shuffling."""
        from app.models import db
        
        with app.app_context():
            topic = Topic(
                name='DevOps',
                description='DevOps practices',
                slug='devops'
            )
            db.session.add(topic)
            db.session.commit()
            
            question = Question(
                topic_id=topic.id,
                question_text='What is Infrastructure as Code?',
                options=['Managing infrastructure through code', 'Writing documentation', 'Manual server setup', 'Database management'],
                correct_answer=0
            )
            db.session.add(question)
            db.session.commit()
            
            question_dict = question.to_dict(shuffle=True)
            
            assert 'id' in question_dict
            assert 'question' in question_dict
            assert 'options' in question_dict
            assert 'correct_answer' in question_dict
            assert len(question_dict['options']) == 4
