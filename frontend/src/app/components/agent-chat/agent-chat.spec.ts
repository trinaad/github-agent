import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentChatComponent } from './agent-chat';

describe('AgentChatComponent', () => {
  let component: AgentChatComponent;
  let fixture: ComponentFixture<AgentChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
